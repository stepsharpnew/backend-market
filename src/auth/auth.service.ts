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
import { ChangePassDTO } from './dto/cahngePassDTO';
import { MailService } from 'src/mail/mail.service';
import { SendMailDTO } from 'src/mail/dto/sendMailDTO';
import PasswordRestoringHTML from 'src/mail/PasswordRestoringHTML';



@Injectable()
export class AuthService {
    constructor (@InjectRepository(UserEntity)
    private userRepository:Repository<UserEntity>,
    private usersService: UserService,
    private jwtService: JwtService,
    private basketService : BasketService,
    private mailService : MailService
    ){}

    async registration(createUserDto : CreateUserDTO)
    {
      console.log(createUserDto);
        const userExist = await this.usersService.findByEmail(createUserDto.email)
        console.log(createUserDto, userExist);
        if (userExist) {
            throw new HttpException('Пользователь уже есть',HttpStatus.UNPROCESSABLE_ENTITY)
        }
        console.log(createUserDto, userExist);
        
        let user = new UserEntity()
        const hashPassword = await bcrypt.hash(createUserDto.password,4)
        Object.assign(user,createUserDto)
        const newUser = await this.userRepository.save({...user,password : hashPassword} )
        const tokens = await this.getTokens(newUser.id,newUser.email,newUser.role)
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
        const tokens = await this.getTokens(findUser.id,findUser.email,findUser.role)
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

    async getTokens(userId: number, email: string, role : string):Promise<{
      accessToken:string,
      refreshToken: string,
      }> {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
              role
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
              role
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
      const tokens = this.getTokens(userId, (await user).email,(await user).role)//Обновление 2-х токенов
      await this.updateRefreshToken((await user).id,(await tokens).refreshToken)//Запись нового в БД
      return tokens
    }


    async changePassword(
      email : string, 
      dto : ChangePassDTO
    ){
      const user = await this.usersService.findByEmail(email)
      console.log(user);
      if (!dto.old_password) {
        throw new HttpException('Актуальный пароль обязателен',HttpStatus.FORBIDDEN)
      }
      const ValidPass = await bcrypt.compare(dto.old_password, user.password)
      if (!ValidPass) {
        throw new HttpException('Актуальный пароль введен неверно',HttpStatus.FORBIDDEN)
      }
      if (dto.new_password !== dto.confirm_password) {
        throw new HttpException('Введенные пароли не совпадают',HttpStatus.FORBIDDEN)
      }
      const hashPass = await bcrypt.hashSync(dto.new_password, 5);
      let newUser= new UserEntity()
      Object.assign(newUser, {...user, password : hashPass})
      return await this.userRepository.save(newUser)
    }



    //RESTORING ------------------------------------------------

    //Смена пароля на хэш код
    private async RestorePasswordForCode(
      code : number,
      user : UserEntity
    ){    
      const hashPass = await bcrypt.hashSync(code.toString(), 5);
      let newUser= new UserEntity()
      Object.assign(newUser, {...user, password : hashPass})
      return await this.userRepository.save(newUser)
    }


    //Отправка письма с кодом
    async RestoringSendMail(email : string){
      console.log(email);
      const user = await this.usersService.findByEmail(email)
      console.log(user);
      
      if (!user) {
        throw new HttpException('Такого пользователя нет',HttpStatus.BAD_REQUEST)
      }
      const authCode = Math.floor(Math.random()*(999999-100000))+100000
      await this.RestorePasswordForCode(authCode, user)

      let sendMailDto = new SendMailDTO(); 
      sendMailDto.from = process.env.MAIL_USERNAME
      sendMailDto.to = email
      sendMailDto.subject = "Код для смены пароля"
      sendMailDto.html = PasswordRestoringHTML(authCode)
      return await this.mailService.sendMail(sendMailDto)
    }

    //Проверка правильности кода кода
    async RestoringCodeConfirm(code : number, email : string):Promise<boolean>{
      const user = await this.usersService.findByEmail(email)
      const codeVerify = await bcrypt.compare(code.toString(), user.password)
      if (!codeVerify) {
        throw new HttpException('Код аутентификации неверный',HttpStatus.BAD_REQUEST)
      }
      return codeVerify
      
    }
    //Любой пользователь может создатть новый пароль
    async RestoringCreateNewPassword(code : number, email : string, changePassDTO : ChangePassDTO){
      if (!this.RestoringCodeConfirm(code, email)) {
        throw new HttpException('Код аутентификации неверный',HttpStatus.BAD_REQUEST)
      }
      console.log(changePassDTO);
      
      const user = await this.usersService.findByEmail(email)

      if (!user) {
        throw new HttpException('Такого пользователя нет',HttpStatus.BAD_REQUEST)
      }
      if ( changePassDTO.new_password !== changePassDTO.confirm_password) {
        throw new HttpException('Введенные пароли не совпадают',HttpStatus.FORBIDDEN)
      }
      const hashPass = await bcrypt.hashSync(changePassDTO.new_password, 5);
      let newUser= new UserEntity()
      Object.assign(newUser, {...user, password : hashPass})
      return await this.userRepository.save(newUser)
    }


}
