import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBlogpostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString({ each: true })
  tag?: string[];

  @IsString()
  content: string;

  @IsDateString()
  date: Date;
}
