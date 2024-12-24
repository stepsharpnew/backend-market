import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RestoringPassDTO } from './dto/RestoringPassDTO';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Модуль авторизации')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary : "Регистрация"})
  @ApiResponse({status : 200, type : UserEntity })
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDTO,@Res() res: Response) {
    console.log(1231);
    let tokens = await this.authService.registration(createUserDto);

    console.log(tokens);
    res.cookie('refresh',tokens.refreshToken, {
      httpOnly : true,
      maxAge : 604800000,
    })
    return res.status(201).send({ accessToken: tokens.accessToken });
  }


  @ApiOperation({summary : "Авторизация"})
  @ApiResponse({status : 200, type : UserEntity })
  @UsePipes(new ValidationPipe())
  @Post('signin')
  async signin(@Body() data: AuthDto,@Res() res: Response) {
    let tokens = await this.authService.login(data);
    res.cookie('refresh',tokens.refreshToken, {
      httpOnly : true,
      maxAge : 604800000,
    })
    
    return res.status(201).send({ accessToken: tokens.accessToken });
  }


  @ApiOperation({summary : "Выход"})
  @ApiResponse({status : 200, type : UserEntity })
  @UseGuards(AccesTokenGeard)
  @Get('logout')
  logout(@Req() req: expressRequestInterface) : Promise<UserEntity> {
    return this.authService.logout(req.user.sub);
  }

  @ApiOperation({summary : "Обновление refresh токена"})
  @ApiResponse({status : 200, type : UserEntity })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokensController(@Req() req : expressRequestInterface):
  Promise<{accessToken:string,refreshToken: string,}>
  {
    const tokens = await this.authService.refreshTokens(req.user.sub, req.user.refreshToken)
    return tokens
    
  }


  @ApiOperation({summary : "Смена пароля"})
  @ApiResponse({status : 200, type : ChangePassDTO })
  @UseGuards(AccesTokenGeard)
  @UsePipes(new ValidationPipe())
  @Post('change_pass')
  changePass(@User('email')email : string, @Body() dto: ChangePassDTO) {
    return this.authService.changePassword(email, dto );
  }


  @ApiOperation({summary : "Восстановление пароля(Отправка на email)"})
  @ApiResponse({status : 200, example : true })
  @Post('restoring')
  @ApiBody({
    schema: {
      properties: {
        email: { example: 'shalkin02@inbox.ru' },
      },
    },
  })
  RestoringPassword(
    @Body('email') email: string) {
    return this.authService.RestoringSendMail(email);
  }

  
  @ApiOperation({summary : "Проверка кода авторизации"})
  @ApiResponse({status : 200})
  @ApiBody({
    schema: {
      properties: {
        email: { example: 'shalkin02@inbox.ru' },
        code: { example: "123342" },
      },
    },
  })
  @Post('confirm_code')
  RestoringCodeConfirm(
    @Body('email') email: string,
    @Body('code') code : number
  ) {
    return this.authService.RestoringCodeConfirm(code,email);
  }


  //Надо в changePassDTO воткнуть code и email
  @ApiOperation({summary : "Создание нового пароля"})
  @ApiResponse({status : 200 })
  @ApiBody({type : RestoringPassDTO})
  @Post('restore_new_password')
  @UsePipes(new ValidationPipe())
  RestoringCreateNewPassword(
    @Body()dto : RestoringPassDTO,
  ) {
    return this.authService.RestoringCreateNewPassword(dto);
  }

}