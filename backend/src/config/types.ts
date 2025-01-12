
import { Request } from "express";
import { UserEntity } from "src/user/user.entity";

export interface expressRequestInterface extends Request{
    user ?: UserEntity & {sub?:number} &{role ?: string}
}