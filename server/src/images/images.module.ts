import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Images } from './models/image.model';
import { Trip } from 'src/trips/models/trip.model';

@Module({
  imports: [SequelizeModule.forFeature([Images, Trip]), CloudinaryModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}