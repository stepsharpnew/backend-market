import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config'
// import { AuthGuard } from './guards/authGuard';
@Module({
  imports : [
    TypeOrmModule.forFeature([UserEntity]),
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWT_SECRET,
    // }),
],
  controllers: [UserController],
  providers: [UserService],
  exports : [UserService,TypeOrmModule]
})
export class UserModule {}
