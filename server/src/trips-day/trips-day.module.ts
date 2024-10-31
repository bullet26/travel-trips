import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TripsDayService } from './trips-day.service';
import { TripsDayController } from './trips-day.controller';
import { Trip } from 'src/trips/models/trip.model';
import { TripDay } from './models/trips-day.model';
import { Place } from 'src/places/models/place.model';
import { PlacesModule } from 'src/places/places.module';

@Module({
  controllers: [TripsDayController],
  providers: [TripsDayService],
  imports: [SequelizeModule.forFeature([Trip, TripDay, Place]), PlacesModule],
  exports: [TripsDayService],
})
export class TripsDayModule {}
