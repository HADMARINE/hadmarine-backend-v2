import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorityEnum } from 'src/users/authority.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindAllPortfolioDto } from './dto/find-all-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Roles(AuthorityEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post()
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

  @Roles(AuthorityEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfoliosService.update(id, updatePortfolioDto);
  }

  @Roles(AuthorityEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portfoliosService.remove(id);
  }
}
