import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DatabaseExecutionException } from 'src/errors/exceptions/database-execution.exception';
import { DatabaseValidationException } from 'src/errors/exceptions/database-validation.exception';
import { Blogpost, BlogpostDocument } from './blogpost.schema';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import {
  FindAllBlogpostDto,
  findAllBlogpostDtoDefaultValue,
} from './dto/find-all-blogpost.dto';

@Injectable()
export class BlogpostsService {
  constructor(
    @InjectModel(Blogpost.name) private blogpostModel: Model<BlogpostDocument>,
  ) {}

  async create(createBlogpostDto: CreateBlogpostDto): Promise<void> {
    const blogpost = new this.blogpostModel(createBlogpostDto);
    try {
      await blogpost.save();
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const paths = Object.keys(e.errors);
        throw new DatabaseValidationException({
          database: 'blogpost',
          path: paths.toString(),
        });
      }
      throw new DatabaseExecutionException({
        action: 'create',
        database: 'blogpost',
      });
    }
  }

  async findAll(
    findAllBlogpostDto: FindAllBlogpostDto = findAllBlogpostDtoDefaultValue,
  ) {
    try {
      const query: FilterQuery<BlogpostDocument> = {};

      await this.blogpostModel
        .find(query)
        .skip(findAllBlogpostDto.offset || 0)
        .limit(findAllBlogpostDto.limit || 10);
    } catch (e) {}
  }

  async findOne(id: number) {
    return `This action returns a #${id} blogpost`;
  }

  async update(id: number, updateBlogpostDto: UpdateBlogpostDto) {
    return `This action updates a #${id} blogpost`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogpost`;
  }
}
