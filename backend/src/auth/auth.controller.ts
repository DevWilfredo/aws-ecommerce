import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CognitoAuthGuard } from './guards/auth.guard';
import { UsersService } from 'src/users/users.service';

interface CognitoIdTokenPayload {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  'cognito:username'?: string;
}

interface CognitoTokenResponse {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('login')
  login(@Res() res: Response, @Query('provider') provider?: string) {
    return res.redirect(this.buildAuthorizeUrl({ provider }));
  }

  @Get('register')
  register(@Res() res: Response, @Query('provider') provider?: string) {
    return res.redirect(
      this.buildAuthorizeUrl({
        provider,
        screenHint: 'signup',
      }),
    );
  }

  private buildAuthorizeUrl(params?: { provider?: string; screenHint?: 'signup' }) {
    const domain = process.env.COGNITO_DOMAIN!;
    const clientId = process.env.COGNITO_CLIENT_ID!;
    const redirectUri = encodeURIComponent(process.env.COGNITO_REDIRECT_URI!);
    let url =
      `${domain}/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=openid+email+profile`;

    if (params?.provider) {
      url += `&identity_provider=${encodeURIComponent(params.provider)}`;
    }

    if (params?.screenHint === 'signup') {
      url += `&screen_hint=signup`;
    }

    return url;
  }

  private parseJwtPayload<T>(token: string): T | null {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
      const base64Payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(parts[1].length / 4) * 4, '=');

      const payload = Buffer.from(base64Payload, 'base64').toString('utf8');
      return JSON.parse(payload) as T;
    } catch {
      return null;
    }
  }

  private getNamesFromPayload(payload: CognitoIdTokenPayload) {
    const givenName = payload.given_name?.trim();
    const familyName = payload.family_name?.trim();

    if (givenName || familyName) {
      return {
        firstname: givenName,
        lastname: familyName,
      };
    }

    const fullName = payload.name?.trim();
    if (fullName) {
      const [firstname, ...lastnameParts] = fullName.split(/\s+/);
      return {
        firstname,
        lastname: lastnameParts.join(' ') || undefined,
      };
    }

    return {
      firstname: payload['cognito:username']?.trim(),
      lastname: undefined,
    };
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('id_token', { path: '/' });

    const domain = process.env.COGNITO_DOMAIN!;
    const clientId = process.env.COGNITO_CLIENT_ID!;
    const logoutRedirect = encodeURIComponent(process.env.APP_URL!);

    const cognitoLogoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${logoutRedirect}`;

    return res.redirect(cognitoLogoutUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) return res.redirect(`${process.env.APP_URL}/?auth=no_code`);

    const domain = process.env.COGNITO_DOMAIN!;
    const clientId = process.env.COGNITO_CLIENT_ID!;
    const redirectUri = process.env.COGNITO_REDIRECT_URI!;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    });

    const basic = Buffer.from(`${clientId}:${process.env.COGNITO_CLIENT_SECRET!}`).toString('base64');

    const tokenRes = await fetch(`${domain}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body,
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.redirect(`${process.env.APP_URL}/?auth=token_failed&details=${encodeURIComponent(err)}`);
    }

    const tokens = (await tokenRes.json()) as CognitoTokenResponse;

    if (!tokens.access_token || !tokens.id_token) {
      return res.redirect(`${process.env.APP_URL}/?auth=invalid_tokens`);
    }

    const payload = this.parseJwtPayload<CognitoIdTokenPayload>(tokens.id_token);
    const sub = payload?.sub?.trim();
    const email = payload?.email?.trim().toLowerCase();

    if (!payload || !sub || !email) {
      return res.redirect(`${process.env.APP_URL}/?auth=missing_user_claims`);
    }

    const { firstname, lastname } = this.getNamesFromPayload(payload);

    try {
      await this.usersService.upsertFromCognito({
        cognitoSub: sub,
        email,
        firstname,
        lastname,
        isEmailVerified: Boolean(payload.email_verified),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'local_sync_error';
      return res.redirect(
        `${process.env.APP_URL}/?auth=local_sync_failed&details=${encodeURIComponent(message)}`,
      );
    }

    const maxAgeMs = (tokens.expires_in ?? 3600) * 1000;

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: maxAgeMs,
    });

    res.cookie('id_token', tokens.id_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: maxAgeMs,
    });

    return res.redirect(`${process.env.APP_URL}/profile`);
  }

  @Get('me')
  @UseGuards(CognitoAuthGuard)
  async me(@Req() req: any) {
    const user = req.user;

    return {
      id: user.id,
      sub: user.cognitoSub,
      email: user.email,
      name: [user.firstname, user.lastname].filter(Boolean).join(' ') || user.email,
      localUserId: user.id,
    };
  }
}
