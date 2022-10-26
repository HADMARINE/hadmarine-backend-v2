import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogpostDto: CreateBlogpostDto) {
    return this.blogpostsService.create(createBlogpostDto);
  }

  @Get()
  findAll(@Query() findAllBlogpostDto: FindAllBlogpostDto) {
    return this.blogpostsService.findAll(findAllBlogpostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogpostsService.findOne(id);
  }

  @Roles(AuthorityEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogpostDto: UpdateBlogpostDto,
  ) {
    return this.blogpostsService.update(id, updateBlogpostDto);
  }

  @Roles(AuthorityEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogpostsService.remove(id);
  }
}
