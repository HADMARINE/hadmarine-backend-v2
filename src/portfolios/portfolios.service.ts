import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio, PortfolioDocument } from './portfolio.schema';
import {
  FindAllPortfolioDto,
  findAllPortfolioDtoDefaultValue,
} from './dto/find-all-portfolio.dto';
import { UtilsService } from 'src/utils/utils.service';
import { DatabaseValidationException } from 'src/errors/exceptions/database-validation.exception';
import { DatabaseExecutionException } from 'src/errors/exceptions/database-execution.exception';
import { DataNotFoundException } from 'src/errors/exceptions/data-not-found.exception';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
    private utilsService: UtilsService,
  ) {}

  async create(
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioDocument> {
    const portfolio = new this.portfolioModel(createPortfolioDto);

    try {
      await portfolio.save();
      return portfolio;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const paths = Object.keys(e.errors);
        throw new DatabaseValidationException({
          path: paths.toString(),
          database: 'portfolio',
        });
      }
      throw new DatabaseExecutionException({
        action: 'create',
        database: 'portfolio',
      });
    }
  }

  async findAll(
    findAllPortfolioDto: FindAllPortfolioDto,
  ): Promise<{ data: PortfolioDocument[]; total: number }> {
    let portfolios: PortfolioDocument[] | [];

    const query = this.utilsService.queryNullableFilter({
      title: findAllPortfolioDto?.query?.title,
      subtitle: findAllPortfolioDto?.query?.subtitle,
      date: {
        $lte: findAllPortfolioDto?.query?.date?.to,
        $gte: findAllPortfolioDto?.query?.date?.from,
      },
    });

    try {
      portfolios = await this.portfolioModel
        .find(query)
        .skip(
          findAllPortfolioDto?.pagination?.offset ||
            findAllPortfolioDtoDefaultValue?.pagination?.offset,
        )
        .limit(
          findAllPortfolioDto?.pagination?.limit ||
            findAllPortfolioDtoDefaultValue?.pagination?.limit,
        );
    } catch (e) {
      throw new DatabaseExecutionException({
        action: 'findAll',
        database: 'portfolio',
      });
    }
    if (portfolios.length === 0) {
      throw new DataNotFoundException({ name: 'portfolio' });
    }

    const total = await this.portfolioModel.count(query);
    return { data: portfolios, total };
  }

  async findOne(id: string): Promise<PortfolioDocument> {
    try {
      const portfolio = await this.portfolioModel.findById(id);
      if (!portfolio) {
        throw new DataNotFoundException({ name: 'portfolio' });
      }
      return portfolio;
    } catch {
      throw new DatabaseExecutionException({
        action: 'findOne',
        database: 'portfolio',
      });
    }
  }

  async update(
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<void> {
    try {
      const portfolio = await this.portfolioModel.findByIdAndUpdate(
        id,
        updatePortfolioDto,
      );
      if (!portfolio) {
        throw new DataNotFoundException({ name: 'portfolio' });
      }
    } catch {
      throw new DatabaseExecutionException({
        action: 'update',
        database: 'portfolio',
      });
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const portfolio = await this.portfolioModel.findByIdAndDelete(id);
      if (!portfolio) {
        throw new DataNotFoundException({ name: 'portfolio' });
      }
    } catch {
      throw new DatabaseExecutionException({
        action: 'remove',
        database: 'portfolio',
      });
    }
  }
}
