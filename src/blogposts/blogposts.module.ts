import { Module } from '@nestjs/common';
import { BlogpostsService } from './blogposts.service';
import { BlogpostsController } from './blogposts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogpost, BlogpostSchema } from './blogpost.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blogpost.name,
        schema: BlogpostSchema,
      },
    ]),
  ],
  controllers: [BlogpostsController],
  providers: [BlogpostsService],
})
export class BlogpostsModule {}
