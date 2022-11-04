import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AuthorizationFailedException } from 'src/errors/exceptions/authorization-failed.exception';
import { JwtTokenExpiredException } from 'src/errors/exceptions/jwt-token-expired.exception';
import { AuthorityEnum } from 'src/users/authority.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(reflector);
  }

  private logger = new Logger(JwtAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<AuthorityEnum[]>(
      'roles',
      context.getHandler(),
    );

    const jwtForceVerify = this.reflector.get<boolean>(
      'jwtForceVerify',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    if (jwtForceVerify) {
      return false;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new JwtTokenExpiredException();
    }

    if (err || !user) {
      this.logger.debug(info);
      throw new AuthorizationFailedException();
    }

    return user;
  }
}
