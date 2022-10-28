import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ParametersInvalidException } from './errors/exceptions/parameters-invalid.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');

  const middlewares: Parameters<typeof app.use> = [
    cookieParser(),
    helmet(),
    express.static('public'),
    express.json(),
    express.urlencoded({ extended: true }),
  ];

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
    // middlewares.push([
    //   '/dev/info/coverage',
    //   express.static('reports/coverage/lcov-report'),
    // ]);
    // middlewares.push(['/dev/info/test', express.static('reports/test')]);
  }

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REQUEST_URI || '*',
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(middlewares);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true,
      exceptionFactory(errors) {
        throw new ParametersInvalidException(errors);
      },
    }),
  );

  await app.listen(process.env.PORT);
  logger.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
