
import { Request } from "express";
import { UserEntity } from "./user/user.entity";

export interface expressRequestInterface extends Request{
    user ?: UserEntity & {sub?:number}
}