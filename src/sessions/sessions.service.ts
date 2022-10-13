import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async findByUser(user: UserDocument): Promise<SessionDocument[]> {
    const sessions = await this.sessionModel.find({ user: user._id }).exec();
    if (!sessions.length) {
      // TODO : RETURN ERROR
      throw 'error';
    }

    return sessions;
  }

  async findByJwtId(id: string): Promise<SessionDocument> {
    const session = await this.sessionModel.findOne({ jwtid: id }).exec();

    if (!session) {
      // TODO : RETURN ERROR
      throw 'error';
    }

    return session;
  }

  // async findByExpire() {}

  async removeExpired() {
    try {
      const result = await this.sessionModel
        .deleteMany({
          expire: { $lt: Math.floor(Date.now() / 1000) },
        })
        .exec();

      if (result.deletedCount === 0) {
        throw 'error'; // TODO: Error
      }
      return result.deletedCount;
    } catch {
      throw 'error'; // TODO: Error
    }
  }
}
