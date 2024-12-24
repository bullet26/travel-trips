import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { Trip } from './models/trip.model';
import { Images } from 'src/images/models/image.model';
import { TripDay } from 'src/trips-day/models/trips-day.model';
import { UnassignedPlaces } from 'src/unassigned-places/models/unassigned-places.model';
import { UnassignedPlacesModule } from 'src/unassigned-places/unassigned-places.module';
import { TripsDayModule } from 'src/trips-day/trips-day.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [TripsController],
  providers: [TripsService],
  imports: [
    SequelizeModule.forFeature([User, Images, Trip, TripDay, UnassignedPlaces]),
    UnassignedPlacesModule,
    TripsDayModule,
    ImagesModule,
  ],
  exports: [TripsService],
})
export class TripsModule {}
