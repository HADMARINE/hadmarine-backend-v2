import { Injectable } from '@nestjs/common';
import packageInfo from '../package.json';
import moment from 'moment';

@Injectable()
export class AppService {
  getHello(): string {
    return `welcome to server`;
  }

  getStatus(): string {
    return 'UP';
  }

  getInfo(): Record<string, any> {
    return {
      state: process.env.NODE_ENV,
      version: packageInfo.version,
    };
  }

  getTime(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }
}
