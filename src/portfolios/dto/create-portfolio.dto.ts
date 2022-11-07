import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsDate()
  date: Date;

  @IsString()
  content: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject() // TODO : Check string type
  link?: Record<string, string>;
}
