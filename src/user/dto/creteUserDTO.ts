import { IsEmail, IsNotEmpty, Length, Min } from "class-validator"

export class CreateUserDTO {
    @IsNotEmpty()
    @IsEmail()
    readonly email : string

    @Length(5, 20)
    @IsNotEmpty()
    readonly password : string

    readonly refreshToken : string
}