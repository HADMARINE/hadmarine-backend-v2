import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import {
  TokenPayloadEntity,
  TOKEN_TYPE,
} from './entities/token.payload.entity';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { SessionsService } from 'src/sessions/sessions.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private sessionService: SessionsService,
    private jwtService: JwtService,
  ) {}

  createToken(
    payload: Record<string, any>,
    type: TOKEN_TYPE,
    expiration: string | number = undefined,
  ): string {
    const expireTime = ((): string | number => {
      if (expiration) return expiration;
      if (type === TOKEN_TYPE.ACCESS) {
        return '10min';
      } else if (type === TOKEN_TYPE.REFRESH) {
        return '1d';
      } else {
        return '1h';
      }
    })();

    const jwtSettings: jwt.SignOptions = {
      expiresIn: expireTime,
      jwtid: `${Date.now()}_${TOKEN_TYPE[type]}`,
      issuer:
        this.configService.getOrThrow('NODE_ENV') === 'development'
          ? '*'
          : this.configService.get('REQUEST_URI') || '*',
    };

    const result = jwt.sign(
      payload,
      this.configService.getOrThrow('TOKEN_KEY'),
      jwtSettings,
    );

    if (type === TOKEN_TYPE.REFRESH) {
      // TODO : This might register the token
    }

    return result;
  }

  createAuthToken(user: User, type: TOKEN_TYPE): string {
    const tokenPayload: TokenPayloadEntity = {
      userid: user.userid,
      type,
      authority: user.authority,
    };

    const result = this.createToken(tokenPayload, type);

    return result;
  }

  async verifyToken(
    token: string,
    type: TOKEN_TYPE,
  ): Promise<Record<string, any> & jwt.JwtPayload> {
    const tokenValue = ((): Record<string, any> & jwt.JwtPayload => {
      try {
        const result = jwt.verify(
          token,
          this.configService.getOrThrow('TOKEN_KEY'),
        );

        if (typeof result === 'string') {
          // TODO : Error
          throw 'error';
        }

        return result;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }
      }
    })();

    if (type === TOKEN_TYPE.REFRESH) {
      const foundToken = await this.sessionService.findByJwtId(tokenValue.jti);
      if (!foundToken) throw 'error'; // TODO : Error
    }

    if (!tokenValue?.type) {
      throw 'error'; // TODO : Error
    }

    if (tokenValue.type !== type) {
      throw 'error'; // TODO : Error
    }

    return tokenValue;
  }

  createPassword(
    password: string,
    customSalt: string = undefined,
  ): { password: string; enckey: string } {
    const buf: string = customSalt || randomBytes(64).toString();
    const key: string = pbkdf2Sync(
      password,
      buf,
      100000,
      64,
      'sha512',
    ).toString('base64');

    return { password: key, enckey: buf };
  }

  verifyPassword(
    password: string,
    encryptedPassword: string,
    enckey: string,
  ): boolean {
    const key: string = pbkdf2Sync(
      password,
      enckey,
      100000,
      64,
      'sha512',
    ).toString('base64');

    return key === encryptedPassword;
  }

  async validateUser(userid: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findOne(userid);
    if (!user) {
      throw new HttpException('Auth Failed', HttpStatus.FORBIDDEN); // TODO : Error
    }

    if (!this.verifyPassword(password, user.password, user.enckey)) {
      throw 'error'; // TODO : Error
    }

    return user;
  }

  getCookieJwtAccessToken(user: UserDocument): string {
    const payload: TokenPayloadEntity = {
      type: TOKEN_TYPE.ACCESS,
      userid: user.userid,
      authority: user.authority,
    };

    const token = this.jwtService.sign(payload);
  }

  getCookieLogout(): string[] {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `RefreshToken=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }
}
