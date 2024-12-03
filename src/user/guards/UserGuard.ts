import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserGuard implements CanActivate {
  // constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    console.log(user);
    

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== 'user') {
      throw new ForbiddenException('User does not have the required role: user');
    }

    return true;
  }
}
