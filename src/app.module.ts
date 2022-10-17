import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';
import { HttpExceptionFactoryFilter } from './filters/http-exception-factory.filter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { BlogpostsController } from './blogposts/blogposts.controller';
import { PortfoliosController } from './portfolios/portfolios.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { BlogpostsService } from './blogposts/blogposts.service';
import { PortfoliosService } from './portfolios/portfolios.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogpostsModule } from './blogposts/blogposts.module';
import { PortfoliosModule } from './portfolios/portfolios.module';

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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.getOrThrow('THROTTLE_TTL'),
        limit: config.getOrThrow('THROTTLE_LIMIT'),
      }),
    }),
    AuthModule,
    UsersModule,
    BlogpostsModule,
    PortfoliosModule,
  ],
  controllers: [
    AppController,
    // AuthController,
    // UsersController,
    // BlogpostsController,
    // PortfoliosController,
  ],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFactoryFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter }, // The order must be like this..
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
