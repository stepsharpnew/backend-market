import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/creteUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TelegramService } from 'src/telegram/telegram.service';
import { FavoriteService } from 'src/favorite/favorite.service';



@Injectable()
export class UserService {
    constructor (@InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>,
    private readonly favoriteService : FavoriteService,
    private readonly telegramService:TelegramService
    ){}

    async registration(createUserDto : CreateUserDTO):
    Promise<UserEntity>
    {
        let user = new UserEntity()
        Object.assign(user,createUserDto)
        const newUser = await this.userRepository.save(user)      
        return newUser
    }
    
    async findById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where : {
                id
            }
        });
      }

      async findByEmail(email: string): Promise<UserEntity> {
    
        return await this.userRepository.findOne({
            where : {
                email 
            }
        });
      }
      
      async update(
        id: number,
        createUserDto : any,
      ): Promise<UserEntity> {
        let user = await this.userRepository.findOne({
            where : {
                id
            }
        })      
        Object.assign(user, createUserDto)
        return await this.userRepository.save(user)

      }

    async findAll(): Promise<UserEntity[]>{
        const users = await this.userRepository.find()
        return users
    }

    async sendNotification(msg : string){
        // const response = await this.
        return await this.telegramService.sendMessage(msg,{
            reply_markup : {
                inline_keyboard : [
                    [{url : "google.com", text : "sosat"}]
                ]
            }
        })
    }
    async sendNotificationFavorites(msg : string){
        // const message = this.favoriteService.
        // return await this.telegramService.sensNotificationFavorites(message)
    }

    async getUserTelegram(email : string){
        const user = await this.findByEmail(email)
        if (!user) {
            return "Нет пользователя с такой почтой"
        }
        console.log(user);
        return user.email
    }


    async AddChatId(chatId : number, email : string){
        let user = await this.findByEmail(email)
        if (!user) {
            return "Нет пользователя с такой почтой"
        }
        
        Object.assign(user, {...user, telegram : chatId})
        await this.userRepository.save(user)
        console.log(user);
        return user.email
    }


}
