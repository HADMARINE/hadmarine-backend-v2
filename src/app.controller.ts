import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { PageNotFoundException } from './errors/exceptions/page-not-found.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Throttle(1, 60)
  getHello(): string {
    return 'Hello';
    throw new PageNotFoundException();
    // throw new HttpException({ Hello: 'world' }, 400);
    // throw new UnauthorizedException();
    // return this.appService.getHello();
  }
}
