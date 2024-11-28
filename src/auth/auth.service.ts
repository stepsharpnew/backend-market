import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/creteUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import 'dotenv/config'
import { AuthDto } from './dto/auth.dto';
import { BasketService } from 'src/basket/basket.service';
import { BasketEntity } from 'src/basket/basket.entity';



@Injectable()
export class AuthService {
    constructor (@InjectRepository(UserEntity)
    private userRepository:Repository<UserEntity>,
    private usersService: UserService,
    private jwtService: JwtService,
    private basketService : BasketService
    ){}

    async registration(createUserDto : CreateUserDTO):
    Promise<{}>
    {
        const userExist = await this.usersService.findByEmail(createUserDto.email)
        if (userExist) {
            throw new HttpException('Пользователь уже есть',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        let user = new UserEntity()
        const hashPassword = await bcrypt.hash(createUserDto.password,4)
        Object.assign(user,createUserDto)
        const newUser = await this.userRepository.save({...user,password : hashPassword} )
        const tokens = await this.getTokens(newUser.id,newUser.email)
        
        let basketEntity = new BasketEntity();
        basketEntity.user = newUser.id;
        await this.basketService.createBasket(basketEntity)
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens
    }

    async login(authDto : AuthDto):
    Promise<{accessToken: string,refreshToken:string}>{      
        const findUser = await this.usersService.findByEmail(authDto.email)
        if (!findUser) {
            throw new HttpException('Такого пользователя не существует',HttpStatus.BAD_REQUEST)
        }
        const validPass = await bcrypt.compare(authDto.password,findUser.password)
        if (!validPass) {
            throw new HttpException('Неправильный пароль',HttpStatus.BAD_REQUEST)
        }
        const tokens = await this.getTokens(findUser.id,findUser.email)
        await this.updateRefreshToken(findUser.id, tokens.refreshToken);
        return tokens
    }
    

    async findAll(): Promise<UserEntity[]>{
        const users = await this.userRepository.find()
        return users
    }

    async hashData(data: string):Promise<string>{
        return await bcrypt.hash(data,5);
      }

    async updateRefreshToken(userId: number, refreshToken: string) : Promise<UserEntity> {
        const hashedRefreshToken = await this.hashData(refreshToken);
        return await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
        
      }

    async getTokens(userId: number, email: string):Promise<{
      accessToken:string,
      refreshToken: string,
      }> {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: process.env.JWT_ACCESS_SECRET,
              expiresIn: '1h',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: process.env.JWT_REFRESH_SECRET,
              expiresIn: '7d',
            },
          ),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async logout(userId: number):Promise<UserEntity> {
        return this.usersService.update(userId, { refreshToken: null });
    }

    async refreshTokens(userId:number, refreshToken : string):
    Promise<{accessToken:string,refreshToken: string,}>
      {
      const user = this.usersService.findById(userId)
      if (!user || !(await user).refreshToken) {
        throw new HttpException('Доступ заблокирован',HttpStatus.FORBIDDEN)
      }
      const checkRefreshTokens = await bcrypt.compare(refreshToken,(await user).refreshToken)
      if (!checkRefreshTokens) {
        throw new HttpException('Доступ заблокирован',HttpStatus.FORBIDDEN)
      }
      const tokens = this.getTokens(userId, (await user).email)//Обновление 2-х токенов
      await this.updateRefreshToken((await user).id,(await tokens).refreshToken)//Запись нового в БД
      return tokens
    }

}
