import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  // constructor(private readonly userService: UserService) 
  // {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('User does not have the required role: admin');
    }

    return true;
  }
}
