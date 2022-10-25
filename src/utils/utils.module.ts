import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  imports: [UtilsService],
})
export class UtilsModule {}
