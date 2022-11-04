import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationFailedException } from 'src/errors/exceptions/authorization-failed.exception';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
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

    return super.handleRequest(err, user, info, context, status);
  }
}
