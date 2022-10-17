import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFactory } from '../errors/http-exception-factory.class';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFactoryFilter implements ExceptionFilter {
  async catch(exception: HttpExceptionFactory, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const i18n = getI18nContextFromArgumentsHost(host);

    const code =
      exception.errorDetails?.code ||
      HttpStatus[status as unknown as keyof typeof HttpStatus] ||
      'INTERNAL_SERVER_ERROR';

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code,
      message: await i18n.t(
        `exceptions.messages.${code}`,
        exception.errorDetails?.exceptionFilter || undefined,
      ),
    });
  }
}
