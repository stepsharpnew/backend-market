import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Length } from "class-validator"

export class ChangePassDTO {
    @ApiProperty({example : "12345", description : "Старый пароль"})
    @IsNotEmpty()
    old_password?: string



    @ApiProperty({example : "123456", description : "Новый пароль"})
    @Length(5, 20)
    @IsNotEmpty()
    new_password: string

    @ApiProperty({example : "123456", description : "Подтвердите новый пароль"})
    @Length(5, 20)
    @IsNotEmpty()
    confirm_password: string

    
}