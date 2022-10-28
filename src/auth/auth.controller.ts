import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SessionsService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { TokenTypeEnum } from './enum/token-type.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionsService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Throttle(5, 300)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessTokenCookie =
      await this.authService.getCookieAuthenticationTokenGenerationIntegrated(
        user,
        TokenTypeEnum.ACCESS,
      );

    const refreshTokenCookie =
      await this.authService.getCookieAuthenticationTokenGenerationIntegrated(
        user,
        TokenTypeEnum.REFRESH,
      );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Post('resign')
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      await this.authService.getCookieAuthenticationTokenGenerationIntegrated(
        request.user,
        TokenTypeEnum.ACCESS,
      );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: Request) {
    const refreshToken = request.cookies?.RefreshToken as string | undefined;
    await this.sessionService.removeUnsure(refreshToken);
    request.res.setHeader('Set-Cookie', this.authService.getCookieLogout());
  }
}
