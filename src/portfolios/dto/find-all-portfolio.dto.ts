import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DateRangeDto } from 'src/dtos/date-range.dto';
import { PaginationQueryDto } from 'src/dtos/pagination-query.dto';
import { DataSortDto } from 'src/dtos/data-sort.dto';

class PortfolioQuery {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => DateRangeDto)
  date?: DateRangeDto;
}

export class FindAllPortfolioDto {
  @IsOptional()
  @Type(() => PortfolioQuery)
  query?: PortfolioQuery;

  @IsOptional()
  @Type(() => PaginationQueryDto)
  pagination?: PaginationQueryDto;

  @IsOptional()
  @Type(() => DataSortDto)
  sort?: DataSortDto;
}

export const findAllPortfolioDtoDefaultValue: FindAllPortfolioDto = {
  pagination: { limit: 10, offset: 0 },
};
