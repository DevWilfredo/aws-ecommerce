import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'cognito-jwt' }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
