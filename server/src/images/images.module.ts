import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Images } from './models/image.model';
import { Trip } from 'src/trips/models/trip.model';
import { Place } from 'src/places/models/place.model';
import { City } from 'src/cities/models/city.model';
import { Country } from 'src/countries/models/country.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Images, Trip, Place, City, Country]),
    CloudinaryModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
