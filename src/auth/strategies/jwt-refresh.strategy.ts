import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtTokenInvalidException } from 'src/errors/exceptions/jwt-token-invalid.exception';
import { UsersService } from 'src/users/users.service';
import { TokenPayloadEntity } from '../entities/token-payload.entity';
import jwt from 'jsonwebtoken';
import { SessionsService } from 'src/sessions/sessions.service';
import { AuthorizationInvalidException } from 'src/errors/exceptions/authorization-invalid.exception';
import mongoose from 'mongoose';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private sessionService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.RefreshToken;
        },
      ]),
      secretOrKey: configService.getOrThrow('REFRESH_TOKEN_KEY'),
      passReqToCallback: true,
    });
  }
  async validate(
    request: Request,
    payload: TokenPayloadEntity & jwt.JwtPayload,
  ) {
    const refreshToken = request.cookies?.RefreshToken;
    if (!refreshToken) {
      throw new AuthorizationInvalidException();
    }

    const jwtid = payload.jti as string | undefined;
    const userid = payload.user as mongoose.Types.ObjectId | undefined;

    if (!jwtid || !userid) {
      throw new JwtTokenInvalidException();
    }

    try {
      await this.sessionService.findByJwtId(payload.jti);
    } catch {
      throw new JwtTokenInvalidException();
    }

    const user = await this.usersService.findById(userid);

    return user;
  }
}
