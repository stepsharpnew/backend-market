import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDTO } from 'src/user/dto/creteUserDTO';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { expressRequestInterface } from 'src/config/types';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/user/decorators/UserDecorator'
import { ChangePassDTO } from './dto/cahngePassDTO';
import { Length } from 'class-validator';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @UsePipes(new ValidationPipe())
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDTO) {
    return this.authService.registration(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @UseGuards(AccesTokenGeard)
  @Get('logout')
  logout(@Req() req: expressRequestInterface) : Promise<UserEntity> {
    console.log(req.user);
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokensController(@Req() req : expressRequestInterface):
  Promise<{accessToken:string,refreshToken: string,}>
  {
    const tokens = await this.authService.refreshTokens(req.user.sub, req.user.refreshToken)
    return tokens
    
  }

  @UseGuards(AccesTokenGeard)
  @UsePipes(new ValidationPipe())
  @Post('change_pass')
  changePass(@User('email')email : string, @Body() dto: ChangePassDTO) {
    return this.authService.changePassword(email, dto );
  }


  @Post('restoring')
  RestoringPassword(@Body('email') email: string) {
    return this.authService.RestoringSendMail(email);
  }

  @Post('confirm_code')
  RestoringCodeConfirm(
    @Body('email') email: string,
    @Body('code') code : number
  ) {
    return this.authService.RestoringCodeConfirm(code,email);
  }

  @Post('restore_new_password')
  @UsePipes(new ValidationPipe())
  RestoringCreateNewPassword(
    @Body('email') email: string,
    @Body('code') code : number,
    @Body()changePassDTO : ChangePassDTO,
    // @Body('new_password')@Length(5,20) new_password: string,
    // @Body('confirm_password') confirm_password : string,
  ) {
    return this.authService.RestoringCreateNewPassword(code,email, changePassDTO);
  }

}