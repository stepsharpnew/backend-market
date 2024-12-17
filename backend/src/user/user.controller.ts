import { Body, Controller, Get, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/creteUserDTO';
import { UserService } from './user.service';
// import { AuthGuard } from './guards/authGuard';
import { Request, Response } from 'express';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';
import { AdminGuard } from './guards/AdminGuard';
import { TelegramService } from 'src/telegram/telegram.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService,
        private readonly telegramService : TelegramService
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


}
