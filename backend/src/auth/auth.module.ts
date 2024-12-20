import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UserModule } from 'src/user/user.module';
import { BasketModule } from 'src/basket/basket.module';
import { MailModule } from 'src/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from 'src/config/cacheService';

@Module({
  imports : [JwtModule.register({
    global: true,
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
  UserModule,
  BasketModule,
  MailModule,
  CacheModule.register({
    ttl : 30000
  })
  // TypeOrmModule.forFeature([ProductEntity,UserEntity])

  
  ],
  controllers: [AuthController,],
  providers: [AuthService,RefreshTokenStrategy,AccessTokenStrategy,CacheService],
  
})
export class AuthModule {}
