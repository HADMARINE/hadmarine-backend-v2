import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorityEnum } from 'src/users/authority.enum';
import { BlogpostsService } from './blogposts.service';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { FindAllBlogpostDto } from './dto/find-all-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Controller('blogposts')
export class BlogpostsController {
  constructor(private readonly blogpostsService: BlogpostsService) {}

  @Roles(AuthorityEnum.ADMIN)
  @Post()
  create(@Body() createBlogpostDto: CreateBlogpostDto) {
    return this.blogpostsService.create(createBlogpostDto);
  }

  @Get()
  findAll(@Query() findAllBlogpostDto: FindAllBlogpostDto) {
    return this.blogpostsService.findAll(findAllBlogpostDto);
  }

  @Roles(AuthorityEnum.ADMIN)
  @Get('/tags')
  getTags() {
    return this.blogpostsService.getTags();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogpostsService.findOne(id);
  }

  @Roles(AuthorityEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogpostDto: UpdateBlogpostDto,
  ) {
    return this.blogpostsService.update(id, updateBlogpostDto);
  }

  @Roles(AuthorityEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogpostsService.remove(id);
  }
}
