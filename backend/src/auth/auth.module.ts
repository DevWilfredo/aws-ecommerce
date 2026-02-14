import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [PassportModule, UsersModule],
    controllers: [AuthController],
    providers: [JwtStrategy]
})
export class AuthModule { }
