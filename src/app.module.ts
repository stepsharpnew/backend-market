import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './typeorm.config';
import { AuthMiddleware } from './user/middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BasketModule } from './basket/basket.module';
import { FileModule } from './file/file.module';
import { ZakazModule } from './zakaz/zakaz.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRoot(mailConfig),
    AuthModule,
    ProductsModule,
    BasketModule,
    FileModule,
    ZakazModule,
    MailModule
  ],
})
export class AppModule 
implements NestModule 
{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
