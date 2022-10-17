import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { PageNotFoundException } from 'src/errors/exceptions/page-not-found.exception';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const next = host.switchToHttp().getNext<NextFunction>();
    next(new PageNotFoundException());
  }
}
