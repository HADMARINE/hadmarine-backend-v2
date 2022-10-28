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
import { UtilsService } from 'src/utils/utils.service';
import { DataNotFoundException } from 'src/errors/exceptions/data-not-found.exception';

@Injectable()
export class BlogpostsService {
  constructor(
    @InjectModel(Blogpost.name) private blogpostModel: Model<BlogpostDocument>,
    private utilsService: UtilsService,
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

  async findAll(findAllBlogpostDto: FindAllBlogpostDto) {
    let blogs: BlogpostDocument[] | [];
    try {
      blogs = await this.blogpostModel
        .find(
          this.utilsService.queryNullableFilter({
            title: findAllBlogpostDto.title,
            subtitle: findAllBlogpostDto.subtitle,
            tags: { $all: findAllBlogpostDto.tags },
            date: {
              $lte: findAllBlogpostDto.date?.to,
              $gte: findAllBlogpostDto.date?.from,
            },
          }),
        )
        .skip(
          findAllBlogpostDto.offset || findAllBlogpostDtoDefaultValue.offset,
        )
        .limit(
          findAllBlogpostDto.limit || findAllBlogpostDtoDefaultValue.limit,
        );
    } catch (e) {
      throw new DatabaseExecutionException({
        action: 'findAll',
        database: 'blogpost',
      });
    }
    if (blogs.length === 0) {
      throw new DataNotFoundException({ name: 'blogpost' });
    }
    return blogs;
  }

  async findOne(id: string): Promise<BlogpostDocument> {
    try {
      const blogpost = await this.blogpostModel.findById(id);
      if (!blogpost) {
        throw new DataNotFoundException({ name: 'blogpost' });
      }
      return blogpost;
    } catch {
      throw new DatabaseExecutionException({
        action: 'findOne',
        database: 'blogpost',
      });
    }
  }

  async update(
    id: string,
    updateBlogpostDto: UpdateBlogpostDto,
  ): Promise<void> {
    try {
      const blogpost = await this.blogpostModel.findByIdAndUpdate(
        id,
        updateBlogpostDto,
      );
      if (!blogpost) throw new DataNotFoundException({ name: 'blogpost' });
    } catch {
      throw new DatabaseExecutionException({
        action: 'update',
        database: 'blogpost',
      });
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const blogpost = await this.blogpostModel.findByIdAndDelete(id);
      if (!blogpost) throw new DataNotFoundException({ name: 'blogpost' });
    } catch {
      throw new DatabaseExecutionException({
        action: 'remove',
        database: 'blogpost',
      });
    }
  }
}
