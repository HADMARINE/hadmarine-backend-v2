import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFactory } from '../http-exception-factory.class';

export class DatabaseValidationException extends HttpExceptionFactory {
  constructor(props?: { path?: string; database?: string }) {
    super(
      {
        code: 'DATABASE_VALIDATION',
        exceptionFilter: {
          args: {
            path: props?.path || '[UNDEFINED]',
            database: props?.database || '[UNDEFINED]',
          },
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
