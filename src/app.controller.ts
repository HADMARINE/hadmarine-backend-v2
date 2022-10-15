import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PageNotFoundException } from './errors/exceptions/PageNotFound.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new PageNotFoundException();
    // throw new HttpException({ Hello: 'world' }, 400);
    // throw new UnauthorizedException();
    // return this.appService.getHello();
  }
}
