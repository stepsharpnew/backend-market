import { IsEmail, IsNotEmpty, Length, Min } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
    email: string;

    @Length(5, 20)
    @IsNotEmpty()
    password: string;
  }