import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogpostsService } from './blogposts.service';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Controller('blogposts')
export class BlogpostsController {
  constructor(private readonly blogpostsService: BlogpostsService) {}

  @Post()
  create(@Body() createBlogpostDto: CreateBlogpostDto) {
    return this.blogpostsService.create(createBlogpostDto);
  }

  @Get()
  findAll() {
    return this.blogpostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogpostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogpostDto: UpdateBlogpostDto) {
    return this.blogpostsService.update(+id, updateBlogpostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogpostsService.remove(+id);
  }
}
