import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  title: string;
  subtitle?: string;
  thumbnail?: string;
  date: Date;
  content: string;
  link?: Record<string, string>;
}
