import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Market')
  .setDescription('The backend-market API description')
  .setVersion('1.2')
  .addTag('market')
  .addBearerAuth()
  .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:5173',
  //   credentials: true,  
  // });
  app.enableCors();
  await app.listen(process.env.PORT);
  // // console.log(`server running on ${process.env.PORT}`);
}
bootstrap();
 