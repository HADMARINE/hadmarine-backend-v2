import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userid: string;

  @IsString()
  password: string;
}
