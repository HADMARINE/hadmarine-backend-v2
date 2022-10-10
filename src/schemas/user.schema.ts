import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, lowercase: true })
  userid: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  enckey: string;

  @Prop({ type: String, default: 'normal' })
  authority?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
