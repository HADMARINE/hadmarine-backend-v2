import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/localAuth.guard';

@Controller('auth')
export class AuthController {
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login() {
    return;
  }
}
