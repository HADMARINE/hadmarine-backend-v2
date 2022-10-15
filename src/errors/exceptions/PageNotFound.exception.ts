import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFactory } from '../httpExceptionFactory.class';

export class PageNotFoundException extends HttpExceptionFactory {
  constructor() {
    super(
      {
        code: 'PAGE_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
