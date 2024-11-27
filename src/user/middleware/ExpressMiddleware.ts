
import { Request } from "express";
import { UserEntity } from "../user.entity";

export interface expressRequestInterface extends Request{
    user ?: UserEntity
}