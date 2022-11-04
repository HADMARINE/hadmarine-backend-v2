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
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorityEnum } from 'src/users/authority.enum';
import { FindAllPortfolioDto } from './dto/find-all-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @Roles(AuthorityEnum.ADMIN)
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfoliosService.create(createPortfolioDto);
  }

  @Get()
  findAll(@Query() findAllPortfolioDto: FindAllPortfolioDto) {
    return this.portfoliosService.findAll(findAllPortfolioDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfoliosService.findOne(id);
  }

  @Patch(':id')
  @Roles(AuthorityEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @Roles(AuthorityEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.portfoliosService.remove(id);
  }
}
