import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthorityEnum } from '../users/authority.enum';
import { User } from '../users/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private logger = new Logger(RolesGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<AuthorityEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request?.user;

    if (!user) {
      this.logger.debug(
        'Data Error : User not found while processing roles - returning false',
      );
      return false;
    }

    for (const ua of user.authority) {
      // User authority
      if (roles.includes(ua)) {
        return true;
      }
    }

    return false;
  }
}
