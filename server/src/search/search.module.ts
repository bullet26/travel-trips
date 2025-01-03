import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [SequelizeModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
