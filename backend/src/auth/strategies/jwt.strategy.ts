import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

function cookieExtractor(req: any): string | null {
    if (!req?.cookies) return null;
    return req.cookies['id_token'] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'cognito-jwt') {
    constructor() {
        const region = process.env.AWS_REGION!;
        const userPoolId = process.env.COGNITO_USER_POOL_ID!;
        const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            issuer,
            algorithms: ['RS256'],
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 10,
                jwksUri: `${issuer}/.well-known/jwks.json`,
            }),
        });
    }

    validate(payload: any) {
        return payload;
    }
}
