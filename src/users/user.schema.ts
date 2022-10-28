import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthorityEnum } from './authority.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, lowercase: true, unique: true })
  userid: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  enckey: string;

  @Prop({ type: [Number], default: [AuthorityEnum.NORMAL] })
  authority: AuthorityEnum[];
}

export const UserSchema = SchemaFactory.createForClass(User);
