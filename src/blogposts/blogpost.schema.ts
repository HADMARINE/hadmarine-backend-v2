import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogpostDocument = Blogpost & Document;

@Schema()
export class Blogpost {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  subtitle?: string;

  @Prop({ type: [String], required: false, default: [] })
  tags: string[];

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, required: true, default: new Date() })
  createdDate: Date;

  @Prop({ type: Date, required: false })
  modifiedDate?: Date;

  @Prop({ type: Boolean, default: false, required: true })
  isPrivate: boolean;

  @Prop({ type: Number, default: 0, required: true })
  viewCount: number;
}

export const BlogpostSchema = SchemaFactory.createForClass(Blogpost);
