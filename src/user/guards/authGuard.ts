// import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import { Observable } from "rxjs";

// @Injectable()

// export class AuthGuard implements CanActivate{
//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const request = context.switchToHttp().getRequest()
//         if (!request.user) {           
//             throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED)
//         }
//         return true

//     }
// }