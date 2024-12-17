import "dotenv/config"
import { Injectable,NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserService } from "../user.service";
import { expressRequestInterface } from "src/config/types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService : JwtService
    ){}

    async use(req: expressRequestInterface, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            req.user = null
            next()
            return
        }
        const token = authHeader.split(' ')[1]
        try {
            const decode = this.jwtService.verify(token,{secret : process.env.JWT_ACCESS_SECRET})
            const user = await this.userService.findById(decode.sub)
            req.user = user    
            next()
        } catch (error) {
            req.user = null 
            next()
        }
    }
}