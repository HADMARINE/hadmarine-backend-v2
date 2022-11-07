import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userid',
      passwordField: 'password',
    });
  }

  async validate(userid: string, password: string): Promise<UserDocument> {
    return await this.authService.validateUser(userid, password);
  }
}
