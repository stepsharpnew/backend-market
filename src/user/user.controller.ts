import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/creteUserDTO';
import { UserService } from './user.service';
// import { AuthGuard } from './guards/authGuard';
import { Request, Response } from 'express';
import { AccesTokenGeard } from 'src/guards/accessToken.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}

    @UsePipes(new ValidationPipe())
    // @Post('reg')
    async registration(
        @Body() createUserDto:CreateUserDTO
    ){
        return await this.userService.registration(createUserDto)
    }

    @Post('logout')
    async logout(
        @Res() res:Response,
        @Req() req:Request
    ){

    }
    @UseGuards(AccesTokenGeard)
    @Get()
    async getAllUsers(){
        return await this.userService.findAll()
    }

}
