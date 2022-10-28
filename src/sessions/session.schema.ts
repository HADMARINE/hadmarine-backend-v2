import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ type: String, required: true, unique: true })
  jwtid: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  expire: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
