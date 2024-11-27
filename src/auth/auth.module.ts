import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [JwtModule.register({
    global: true,
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: { expiresIn: '1h' },
  }), UserModule],
  controllers: [AuthController],
  providers: [AuthService,RefreshTokenStrategy,AccessTokenStrategy],
})
export class AuthModule {}