import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import packageJson from '../package.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  main(): string {
    return 'UP';
  }

  @Get('status')
  getStatus(): string {
    return 'UP';
  }

  @Get('version')
  getVersion(): string {
    return packageJson.version;
  }
}
