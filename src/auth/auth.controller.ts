import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TOKEN_TYPE } from './entities/token.payload.entity';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { SessionsService } from 'src/sessions/sessions.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionsService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessTokenCookie =
      await this.authService.getCookieAuthenticationTokenGenerationIntegrated(
        user,
        TOKEN_TYPE.ACCESS,
      );

    const refreshTokenCookie =
      await this.authService.getCookieAuthenticationTokenGenerationIntegrated(
        user,
        TOKEN_TYPE.REFRESH,
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
        TOKEN_TYPE.ACCESS,
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
