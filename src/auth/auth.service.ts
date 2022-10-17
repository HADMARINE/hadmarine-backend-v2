import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { TokenPayloadEntity } from './entities/token-payload.entity';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { SessionsService } from 'src/sessions/sessions.service';
import ms from 'ms';
import { JwtTokenInvalidException } from 'src/errors/exceptions/jwt-token-invalid.exception';
import { JwtTokenExpiredException } from 'src/errors/exceptions/jwt-token-expired.exception';
import { AuthorizationFailedException } from 'src/errors/exceptions/authorization-failed.exception';
import { TokenTypeEnum } from './enum/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private configService: ConfigService,
    private sessionService: SessionsService,
  ) {}

  async createToken(
    payload: Record<string, any>,
    type: TokenTypeEnum,
    expiration: string | number = undefined,
  ): Promise<string> {
    const expireTime = ((): string | number => {
      if (expiration) return expiration;
      if (type === TokenTypeEnum.ACCESS) {
        return this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION_TIME');
      } else if (type === TokenTypeEnum.REFRESH) {
        return this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION_TIME');
      } else {
        return '1h';
      }
    })();

    const tokenKey = ((): string => {
      switch (type) {
        case TokenTypeEnum.ACCESS:
          return this.configService.getOrThrow('ACCESS_TOKEN_KEY');
        case TokenTypeEnum.REFRESH:
          return this.configService.getOrThrow('REFRESH_TOKEN_KEY');
        case TokenTypeEnum.OTHER:
          return this.configService.getOrThrow('TOKEN_KEY');
      }
    })();

    const jwtSettings: jwt.SignOptions = {
      expiresIn: expireTime,
      jwtid: `${Date.now()}_${TokenTypeEnum[type]}`,
      issuer:
        this.configService.getOrThrow('NODE_ENV') === 'development'
          ? '*'
          : this.configService.get('REQUEST_URI') || '*',
    };

    const result = jwt.sign(payload, tokenKey, jwtSettings);

    if (type === TokenTypeEnum.REFRESH) {
      const jwtDecoded: any = jwt.decode(result);
      if (!jwtDecoded.exp || !jwtDecoded.jti || !jwtDecoded.userid) {
        throw new JwtTokenInvalidException();
      }
      await this.sessionService.create({
        expire: jwtDecoded.exp,
        user: jwtDecoded.userid,
        jwtid: jwtDecoded.jti,
      });
    }

    return result;
  }

  async createAuthToken(
    user: UserDocument,
    type: TokenTypeEnum.ACCESS | TokenTypeEnum.REFRESH,
  ): Promise<string> {
    const tokenPayload: TokenPayloadEntity = {
      userid: user.userid,
      type,
      authority: user.authority,
    };

    const result = await this.createToken(tokenPayload, type);

    return result;
  }

  async verifyToken(
    token: string,
    type: TokenTypeEnum,
  ): Promise<Record<string, any> & jwt.JwtPayload> {
    const tokenValue = ((): Record<string, any> & jwt.JwtPayload => {
      try {
        const result = jwt.verify(
          token,
          this.configService.getOrThrow('TOKEN_KEY'),
        );

        if (typeof result === 'string') {
          throw new JwtTokenInvalidException();
        }

        return result;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new JwtTokenExpiredException();
        }
      }
    })();

    if (type === TokenTypeEnum.REFRESH) {
      try {
        await this.sessionService.findByJwtId(tokenValue.jti);
      } catch {
        throw new JwtTokenInvalidException();
      }
    }

    if (!tokenValue?.type) {
      throw new JwtTokenInvalidException();
    }

    if (tokenValue.type !== type) {
      throw new JwtTokenInvalidException();
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
      throw new AuthorizationFailedException();
    }

    if (!this.verifyPassword(password, user.password, user.enckey)) {
      throw new AuthorizationFailedException();
    }

    return user;
  }

  async getCookieAuthenticationTokenGenerationIntegrated(
    user: UserDocument,
    type: TokenTypeEnum.ACCESS | TokenTypeEnum.REFRESH,
  ): Promise<string> {
    const token = await this.createAuthToken(user, type);
    return `${
      type === TokenTypeEnum.ACCESS ? `Authentication` : `RefreshToken`
    }=${token}; HttpOnly; Path=/' Max-Age=${ms(
      this.configService.getOrThrow(
        type === TokenTypeEnum.ACCESS
          ? 'ACCESS_TOKEN_EXPIRATION_TIME'
          : 'REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    )};`;
  }

  getCookieLogout(): string[] {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `RefreshToken=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }
}
