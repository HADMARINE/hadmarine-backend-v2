import { Module } from '@nestjs/common';
import { BlogpostsService } from './blogposts.service';
import { BlogpostsController } from './blogposts.controller';

@Module({
  controllers: [BlogpostsController],
  providers: [BlogpostsService]
})
export class BlogpostsModule {}
