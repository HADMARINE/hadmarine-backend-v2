import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/dtos/date-range.dto';
import { PaginationQueryDto } from 'src/dtos/pagination-query.dto';

export class FindAllBlogpostDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Type(() => DateRangeDto)
  date?: DateRangeDto;
}

export const findAllBlogpostDtoDefaultValue: FindAllBlogpostDto = {
  limit: 10,
  offset: 0,
};
