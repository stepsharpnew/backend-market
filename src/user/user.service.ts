import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/creteUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TelegramService } from 'src/telegram/telegram.service';



@Injectable()
export class UserService {
    constructor (@InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>,
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
        return await this.telegramService.sendMessage(msg,{
            reply_markup : {
                inline_keyboard : [
                    [{url : "google.com", text : "sosat"}]
                ]
            }
        })

    }

}
