import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  limit?: number; // Number of rows to fetch from the DB

  @IsOptional()
  @IsNumber()
  offset?: number; // Number of ROWS to skip
}
