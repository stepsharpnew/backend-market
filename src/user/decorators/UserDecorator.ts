import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data : any, ctx : ExecutionContext)=>{
    const request = ctx.switchToHttp().getRequest()

    if(!request.user){
        request.user = null
        return null
    }

    if (data) {
        request.user[data] = data
        return null
    }
    return request.user 


})