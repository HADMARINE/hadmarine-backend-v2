import { Module } from '@nestjs/common';
import { BlogpostsService } from './blogposts.service';
import { BlogpostsController } from './blogposts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogpost, BlogpostSchema } from './blogpost.schema';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blogpost.name,
        schema: BlogpostSchema,
      },
    ]),
    UtilsModule,
  ],
  controllers: [BlogpostsController],
  providers: [BlogpostsService],
})
export class BlogpostsModule {}
