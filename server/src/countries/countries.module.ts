import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Images } from 'src/images/models/image.model';
import { City } from 'src/cities/models/city.model';
import { Country } from './models/country.model';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
  imports: [SequelizeModule.forFeature([City, Images, Country])],
})
export class CountriesModule {}
