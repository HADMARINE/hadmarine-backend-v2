import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SessionsService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { TokenTypeEnum } from './enum/token-type.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtForceVerify } from 'src/decorators/jwt-force-verify.decorator';
import { AuthorityEnum } from 'src/users/authority.enum';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionsService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Throttle(5, 300)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;

    request.res.cookie(
      ...(await this.authService.getCookieConfigTokenGenerationIntegrated(
        user,
        TokenTypeEnum.ACCESS,
      )),
    );

    request.res.cookie(
      ...(await this.authService.getCookieConfigTokenGenerationIntegrated(
        user,
        TokenTypeEnum.REFRESH,
      )),
    );

    return { userid: user.userid };
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Post('resign')
  async refresh(@Req() request: RequestWithUser) {
    request.res.cookie(
      ...(await this.authService.getCookieConfigTokenGenerationIntegrated(
        request.user,
        TokenTypeEnum.ACCESS,
      )),
    );

    return { userid: request.user.userid };
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: Request) {
    const refreshToken = request.cookies?.RefreshToken as string | undefined;
    await this.sessionService.removeUnsure(refreshToken);
    request.res.clearCookie('Authentication');
    request.res.clearCookie('RefreshToken');
  }

  @Get('authority/number')
  @Roles()
  getAuthorityNumber(@Req() request: RequestWithUser): AuthorityEnum[] {
    return request.user.authority;
  }

  @Get('authority/string')
  @Roles()
  getAuthorityString(@Req() request: RequestWithUser): string[] {
    return request.user.authority.map((v) => AuthorityEnum[v as AuthorityEnum]);
  }

  @Get('verify/token')
  @Roles()
  verifyToken(): string {
    return 'OK';
  }

  @Get('verify/normal')
  @Roles(AuthorityEnum.NORMAL)
  verifyNormalAuthority(): string {
    return 'OK';
  }

  @Get('verify/admin')
  @Roles(AuthorityEnum.ADMIN)
  verifyAdminAuthority(): string {
    return 'OK';
  }
}
