import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Min } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({example : "shalkin02@inbox.ru", description : "Почта пользователя"})
  email: string;

  @Length(5, 20)
  @IsNotEmpty()
  @ApiProperty({example : "12345", description : "Пароль пользователя"})
  password: string;
  }