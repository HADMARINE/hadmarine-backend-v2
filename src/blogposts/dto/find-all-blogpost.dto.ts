import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeDto } from 'src/dtos/date-range.dto';
import { PaginationQueryDto } from 'src/dtos/pagination-query.dto';
import { DataSortDto } from 'src/dtos/data-sort.dto';

class BlogPostQuery {
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
  createdDate?: DateRangeDto;

  @IsOptional()
  @Type(() => DateRangeDto)
  modifiedDate?: DateRangeDto;

  @IsOptional()
  @IsBooleanString()
  isPrivate?: boolean;
}

export class FindAllBlogpostDto {
  @IsOptional()
  @Type(() => BlogPostQuery)
  query?: BlogPostQuery;

  @IsOptional()
  @Type(() => PaginationQueryDto)
  pagination?: PaginationQueryDto;

  @IsOptional()
  @Type(() => DataSortDto)
  sort?: DataSortDto;
}

export const findAllBlogpostDtoDefaultValue: FindAllBlogpostDto = {
  pagination: { limit: 10, offset: 0 },
};
