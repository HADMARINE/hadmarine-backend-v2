import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ErrorsService {
  haveError() {
    // return new UnauthorizedException().;
  }
}
