import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFactory } from '../errors/httpExceptionFactory.class';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFactoryFilter implements ExceptionFilter {
  async catch(exception: HttpExceptionFactory, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const i18n = getI18nContextFromArgumentsHost(host);

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: exception.errorDetails.code,
      message: await i18n.t(
        `exceptions.messages.${exception.errorDetails.code}`,
        exception.errorDetails.exceptionFilter,
      ),
    });
  }
}
