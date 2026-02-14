import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import * as jwksRsa from 'jwks-rsa';
import { User } from 'src/users/entities/user.entity';

function cookieExtractor(req: any): string | null {
    if (!req?.cookies) return null;
    return req.cookies['id_token'] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'cognito-jwt') {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
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

    async validate(payload: any) {
        const cognitoSub = payload?.sub;
        if (!cognitoSub) throw new UnauthorizedException('Invalid token payload');

        const user = await this.userRepo.findOne({ where: { cognitoSub } });
        if (!user) throw new UnauthorizedException('User not found');

        return user;
    }
}
