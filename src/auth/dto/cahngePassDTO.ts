import { IsNotEmpty, Length } from "class-validator"

export class ChangePassDTO{
    old_password : string

    @Length(5, 20)
    @IsNotEmpty()
    new_password : string

    @Length(5, 20)
    @IsNotEmpty()
    confirm_password : string
}