import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFactory } from '../httpExceptionFactory.class';

export class AuthorizationFailedException extends HttpExceptionFactory {
  constructor() {
    super(
      {
        code: 'AUTHORIZATION_FAILED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
