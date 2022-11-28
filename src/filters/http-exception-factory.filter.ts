import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFactory } from '../errors/http-exception-factory.class';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFactoryFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFactoryFilter.name);

  async catch(exception: HttpExceptionFactory, host: ArgumentsHost) {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      this.logger.error(exception);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const i18n = getI18nContextFromArgumentsHost(host);

    const code =
      exception.errorDetails?.code ||
      HttpStatus[status as unknown as keyof typeof HttpStatus] ||
      'INTERNAL_SERVER_ERROR';

    const message = await (async () => {
      try {
        return await i18n.t(
          `exceptions.messages.${code}`,
          exception.errorDetails?.exceptionFilter || undefined,
        );
      } catch {
        return 'undefined';
      }
    })();

    const responseData = {
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code,
      message,
    };

    if (exception?.errorDetails?.additionalDataHandler) {
      Object.assign(responseData, {
        data: exception.errorDetails.additionalDataHandler(i18n),
      });
    }

    response.status(status).json(responseData);
  }
}
