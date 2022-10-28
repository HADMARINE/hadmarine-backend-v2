import { IsDate, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDate()
  from?: Date;

  @IsOptional()
  @IsDate()
  to?: Date;
}
