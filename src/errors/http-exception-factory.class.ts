import { HttpException } from '@nestjs/common';
import { TranslateOptions } from 'nestjs-i18n';

export interface ErrorInterface {
  code: string;
  exceptionFilter?: TranslateOptions;
}

export class HttpExceptionFactory extends HttpException {
  constructor(private _errorDetails: ErrorInterface, status: number) {
    super(_errorDetails, status);
  }

  public get errorDetails(): ErrorInterface {
    return this._errorDetails;
  }
}
