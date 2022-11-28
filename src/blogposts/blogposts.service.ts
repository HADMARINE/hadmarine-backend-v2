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
import { HttpExceptionFactory } from 'src/errors/http-exception-factory.class';

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
    const query = this.utilsService.queryNullableFilter({
      title: findAllBlogpostDto.query?.title,
      subtitle: findAllBlogpostDto.query?.subtitle,
      tags: { $all: findAllBlogpostDto.query?.tags },
      createdDate: {
        $lte: findAllBlogpostDto.query?.createdDate?.to,
        $gte: findAllBlogpostDto.query?.createdDate?.from,
      },
      modifiedDate: {
        $lte: findAllBlogpostDto.query?.modifiedDate?.to,
        $gte: findAllBlogpostDto.query?.modifiedDate?.from,
      },
    });

    const sort =
      (findAllBlogpostDto.sort?.field &&
        findAllBlogpostDto.sort?.order && {
          [findAllBlogpostDto.sort.field]:
            findAllBlogpostDto.sort.order.toLowerCase() as 'asc' | 'desc',
        }) ||
      {};

    try {
      const blogposts = await this.blogpostModel
        .find(query)
        .skip(
          findAllBlogpostDto.pagination?.offset ||
            findAllBlogpostDtoDefaultValue.pagination.offset,
        )
        .limit(
          findAllBlogpostDto.pagination?.limit ||
            findAllBlogpostDtoDefaultValue.pagination.limit,
        )
        .sort(sort);
      if (blogposts.length === 0) {
        throw new DataNotFoundException({ name: 'blogpost' });
      }
      const total = await this.blogpostModel.count(query);
      return { data: blogposts, total };
    } catch (e) {
      console.log(e);
      if (e instanceof HttpExceptionFactory) {
        throw e;
      }

      throw new DatabaseExecutionException({
        action: 'findAll',
        database: 'blogpost',
      });
    }
  }

  async findOne(id: string): Promise<BlogpostDocument> {
    try {
      const blogpost = await this.blogpostModel.findById(id);
      await this.blogpostModel.findByIdAndUpdate(id, {
        viewCount: blogpost.viewCount + 1,
      });
      if (!blogpost) {
        throw new DataNotFoundException({ name: 'blogpost' });
      }
      return blogpost;
    } catch (e) {
      if (e instanceof HttpExceptionFactory) {
        throw e;
      }

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
      const blogpost = await this.blogpostModel.findByIdAndUpdate(id, {
        ...updateBlogpostDto,
        modifiedDate: new Date(),
      });
      if (!blogpost) throw new DataNotFoundException({ name: 'blogpost' });
    } catch (e) {
      if (e instanceof HttpExceptionFactory) {
        throw e;
      }

      throw new DatabaseExecutionException({
        action: 'update',
        database: 'blogpost',
      });
    }
  }

  async remove(id: string): Promise<BlogpostDocument> {
    try {
      const blogpost = await this.blogpostModel.findByIdAndDelete(id);

      if (!blogpost) throw new DataNotFoundException({ name: 'blogpost' });

      return blogpost;
    } catch (e) {
      if (e instanceof HttpExceptionFactory) {
        throw e;
      }

      throw new DatabaseExecutionException({
        action: 'remove',
        database: 'blogpost',
      });
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const tags = await this.blogpostModel.distinct('tags');
      if (!tags) throw new DataNotFoundException({ name: 'blogpost/tags' });
      return tags as string[];
    } catch (e) {
      if (e instanceof HttpExceptionFactory) {
        throw e;
      }
      throw new DatabaseExecutionException({
        action: 'getTags',
        database: 'blogpost',
      });
    }
  }
}
