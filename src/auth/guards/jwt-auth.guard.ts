import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthorizationFailedException } from 'src/errors/exceptions/authorization-failed.exception';
import { AuthorityEnum } from 'src/users/authority.enum';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new AuthorizationFailedException();
    }
    return user;
  }
}

// {
//   constructor(private reflector: Reflector, ...args: any[]) {
//     super(reflector, ...args);
//   }

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     if (!super.canActivate(context)) {
//       return false;
//     }

//     const roles = this.reflector.get<AuthorityEnum>(
//       'roles',
//       context.getHandler(),
//     );
//     if (!roles) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const user: UserDocument = request.user;
//   }
// }
