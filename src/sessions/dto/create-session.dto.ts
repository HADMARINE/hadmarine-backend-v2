import mongoose from 'mongoose';

export class CreateSessionDto {
  jwtid: string;
  user: mongoose.Schema.Types.ObjectId;
  expire: number;
}
