import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogpostDocument = Blogpost & Document;

@Schema()
export class Blogpost {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  subtitle?: string;

  @Prop({ type: [String], default: [] })
  tag: string[];

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const BlogpostSchema = SchemaFactory.createForClass(Blogpost);
