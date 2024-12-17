import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, Length, Min } from "class-validator"

export class CreateUserDTO {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example : "shalkin02@inbox.ru", description : "Почта пользователя"})
    readonly email : string

    @ApiProperty({example : "12345", description : "Пароль пользователя"})
    @Length(5, 20)
    @IsNotEmpty()
    readonly password : string

    readonly refreshToken : string
}