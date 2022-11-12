import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ParametersInvalidException } from './errors/exceptions/parameters-invalid.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import packageInfo from '../package.json';

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
    origin: process.env.REQUEST_URI || '*',
    credentials: true,
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription('Nest.JS applied new version')
    .setVersion(packageInfo.version)
    .addCookieAuth(
      'Authentication',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'Authentication',
      },
      'Authentication',
    )
    .addCookieAuth(
      'RefreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'RefreshToken',
      },
      'RefreshToken',
    )
    // .addTag('')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('dev/api', app, swaggerDocument);

  await app.listen(process.env.PORT);

  logger.log(
    `Application is running on ${await app.getUrl()} , NODE_ENV=${
      process.env.NODE_ENV
    }`,
  );
}
bootstrap();
