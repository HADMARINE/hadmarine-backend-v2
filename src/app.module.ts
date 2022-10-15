import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { BlogpostsModule } from './blogposts/blogposts.module';
import { CookieResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './filters/notFoundException.filter';
import { HttpExceptionFactoryFilter } from './filters/httpExceptionFactory.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_HOST, {
      auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      },
      dbName: process.env.DB_NAME,
    }),
    PortfoliosModule,
    BlogpostsModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: CookieResolver, options: ['lang'] },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFactoryFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter }, // The order must be like this..
  ],
})
export class AppModule {}
