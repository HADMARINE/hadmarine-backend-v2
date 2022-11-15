import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class CreateBlogpostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  content: string;

  @IsOptional()
  @IsBooleanString()
  isPrivate?: boolean;
}
