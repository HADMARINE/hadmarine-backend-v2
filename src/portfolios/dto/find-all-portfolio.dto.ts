import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DateRangeDto } from 'src/dtos/date-range.dto';
import { PaginationQueryDto } from 'src/dtos/pagination-query.dto';

export class FindAllPortfolioDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @Type(() => DateRangeDto)
  date?: DateRangeDto;
}

export const findAllPortfolioDtoDefaultValue: FindAllPortfolioDto = {
  limit: 10,
  offset: 0,
};
