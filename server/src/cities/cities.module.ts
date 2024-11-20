import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Place } from 'src/places/models/place.model';
import { Images } from 'src/images/models/image.model';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './models/city.model';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [SequelizeModule.forFeature([City, Place, Images])],
})
export class CitiesModule {}
