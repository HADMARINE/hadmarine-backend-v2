import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';
import { UserDocument } from 'src/users/user.schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { ConfigService } from '@nestjs/config';
import { DatabaseExecutionException } from 'src/errors/exceptions/database-execution.exception';
import { DataNotFoundException } from 'src/errors/exceptions/data-not-found.exception';
import { DatabaseValidationException } from 'src/errors/exceptions/database-validation.exception';
import { JwtTokenInvalidException } from 'src/errors/exceptions/jwt-token-invalid.exception';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private configService: ConfigService,
  ) {}

  async findByUser(user: UserDocument): Promise<SessionDocument[]> {
    const sessions = await this.sessionModel.find({ user: user._id }).exec();
    if (!sessions.length) {
      throw new DataNotFoundException({ name: 'session' });
    }

    return sessions;
  }

  async findByJwtId(id: string): Promise<SessionDocument> {
    const session = await this.sessionModel.findOne({ jwtid: id }).exec();

    if (!session) {
      throw new DataNotFoundException({ name: 'session' });
    }

    return session;
  }

  // async findByExpire() {}

  async removeExpired(): Promise<number> {
    try {
      const result = await this.sessionModel
        .deleteMany({
          expire: { $lt: Math.floor(Date.now() / 1000) },
        })
        .exec();

      return result.deletedCount;
    } catch {
      throw new DatabaseExecutionException({
        action: 'delete',
        database: 'session',
      });
    }
  }

  async remove(jwtid: string) {
    try {
      const result = await this.sessionModel.findOneAndDelete({
        jwtid,
      });

      if (!result) {
        throw new DataNotFoundException({ name: 'session' });
      }
    } catch {
      throw new DatabaseExecutionException({
        action: 'delete',
        database: 'session',
      });
    }
  }

  async removeUnsure(token: string | undefined) {
    if (typeof token !== 'string') return;

    const decodedToken = (() => {
      try {
        return jwt.verify(
          token,
          this.configService.getOrThrow('REFRESH_TOKEN_KEY'),
        );
      } catch {
        return undefined;
      }
    })();

    if (typeof decodedToken !== 'string') {
      await this.remove((decodedToken as jwt.JwtPayload).jti);
    }
  }

  async create(createSessonDto: CreateSessionDto) {
    console.log(createSessonDto);
    const session = new this.sessionModel({ ...createSessonDto });
    try {
      await session.save();
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const paths = Object.keys(e.errors);
        throw new DatabaseValidationException({
          database: 'session',
          action: 'create',
          path: paths.toString(),
        });
      } else {
        throw new DatabaseExecutionException({
          action: 'create',
          database: 'session',
        });
      }
    }
    return session;
  }
}
