import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFactory } from '../httpExceptionFactory.class';

export class JwtTokenInvalidException extends HttpExceptionFactory {
  constructor() {
    super(
      {
        code: 'JWT_TOKEN_INVALID',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
