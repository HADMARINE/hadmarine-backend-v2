import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import {
  TokenPayloadEntity,
  TOKEN_TYPE,
} from './entities/token.payload.entity';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
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
    const tokenPayload = new TokenPayloadEntity(
      user.userid,
      type,
      user.authority,
    );

    const result = this.createToken(tokenPayload.objectify(), type);

    return result;
  }

  async verifyToken(
    token: string,
    type: TOKEN_TYPE,
  ): Promise<Record<string, any>> {
    const tokenValue: ReturnType<typeof jwt.verify> = () => {
      try {
        return jwt.verify(token, this.configService.getOrThrow('TOKEN_KEY'));
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }
      }
    };
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

  async validateUser(userid: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(userid);
    if (!user) {
      throw new HttpException('Auth Failed', HttpStatus.FORBIDDEN);
    }
  }
}
