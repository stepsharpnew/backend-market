import { Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/creteUserDTO';
import { UserService } from './user.service';
// import { AuthGuard } from './guards/authGuard';
import { Request, Response } from 'express';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { AdminGuard } from './guards/AdminGuard';
import { TelegramService } from 'src/telegram/telegram.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './decorators/UserDecorator';
import { UserEntity } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService,
        private readonly telegramService : TelegramService,
        private readonly fileService : FileService,
    ){}

    @UsePipes(new ValidationPipe())
    async registration(
        @Body() createUserDto:CreateUserDTO
    ){
        return await this.userService.registration(createUserDto)
    }

    
    @UseGuards(AccesTokenGeard,AdminGuard)
    @Get('get_all')
    async getAllUsers(){
        return await this.userService.findAll()
    }

    @UseGuards(AccesTokenGeard)
    @Post('notify')
    async Notify(
        @Body('msg') msg : string
    ){
        return await this.userService.sendNotification(msg)
    }


    
    @Post('tg-email/:email')
    async tgEmail(
        @Param('email') email : string,
    ){
        const user_email = await this.userService.getUserTelegram(email)
        console.log(user_email);
        return user_email
    }

    
        //Создание ChatId у user
    @Post('add-chat-id')
    async AddChatId(
        @Body('email') email : string,
        @Body('chatId') chatId : number
    ){
        const user = await this.userService.AddChatId(chatId,email)
        console.log(user);

        return user
    }


    @ApiOperation({summary : "Изменение профиля"})
    @ApiResponse({status : 200, type : UserEntity })
    @UsePipes(new ValidationPipe())
    @UseGuards(AccesTokenGeard)
    @Put('edit')
    async signin(
        @Body() user: CreateUserDTO,
        @Res() res: Response,
        @User() user_sub : any
    ) {
      let newUser = await this.userService.editProfile(user, user_sub.sub);
      res.cookie('refresh',newUser.refreshToken, {
        httpOnly : true,
        maxAge : 604800000,
      })
      
      return newUser;
    }


    @ApiOperation({summary : "Добавить аватарку"})
    @ApiResponse({status : 200, type : UserEntity })
    @ApiConsumes('multipart/form-data')
    @ApiBody({schema : {
      type : 'object',
      properties : {
        file : {
          type : 'string',
          format : 'binary'
        }
      }
    }})
    @Post('addphoto')
    @UseGuards(AccesTokenGeard)
    @UseInterceptors(FileInterceptor('file'))

    async takeFile(
      @UploadedFile() file : Express.Multer.File,
      @User() user : any,
    ){
        console.log(file);
        
      return this.fileService.addFileProductUser(file,user.sub)
    }

    @UseGuards(AccesTokenGeard)
    @Get('/me')
    async getMe(
        @User() user : any,
    ){
        const user_info = this.userService.findById(user.sub)
        return user_info
    }


    // @ApiOperation({summary : "Изменение профиля"})
    // @ApiResponse({status : 200, type : UserEntity })
    // @UseGuards(AccesTokenGeard, AdminGuard)
    // @Post('/m')
    // async banUser(
    //     @User() user : any,
    //     @Body('user_id') user_id : number
    // ){
    //     const ban_user = this.userService.banUser(user.sub, user_id)
    //     return ban_user
    // }

    


}
