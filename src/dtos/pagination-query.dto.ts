import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  limit?: number; // Number of rows to fetch from the DB

  @IsOptional()
  @IsNumberString()
  offset?: number; // Number of ROWS to skip
}
