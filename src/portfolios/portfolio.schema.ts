import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Portfolio {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, reuqired: false })
  subtitle?: string;

  @Prop({ type: String, required: false })
  thumbnail?: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Object, required: false })
  link?: Record<string, string>;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
