import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Place } from 'src/places/models/place.model';
import { Images } from 'src/images/models/image.model';
import { Country } from 'src/countries/models/country.model';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './models/city.model';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [
    SequelizeModule.forFeature([City, Place, Images, Country]),
    ImagesModule,
  ],
})
export class CitiesModule {}
