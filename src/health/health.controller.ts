import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  //   @Get('google')
  //   @HealthCheck()
  //   checkGoogle() {
  //     return this.health.check([
  //       () => this.http.pingCheck('google', 'https://google.com'),
  //     ]);
  //   }

  // TODO : HealthCheck of MongoDB
}
