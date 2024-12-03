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
import { expressRequestInterface } from 'src/types';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { UserEntity } from 'src/user/user.entity';


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
}