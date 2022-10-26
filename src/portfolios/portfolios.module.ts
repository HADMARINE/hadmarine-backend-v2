import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './portfolio.schema';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    UtilsModule,
  ],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
})
export class PortfoliosModule {}
