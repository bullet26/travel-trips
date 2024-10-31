import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnassignedPlacesService } from './unassigned-places.service';
import { Trip } from 'src/trips/models/trip.model';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place } from 'src/places/models/place.model';
import { PlacesModule } from 'src/places/places.module';

@Module({
  providers: [UnassignedPlacesService],
  imports: [
    SequelizeModule.forFeature([Trip, UnassignedPlaces, Place]),
    PlacesModule,
  ],
  exports: [UnassignedPlacesService],
})
export class UnassignedPlacesModule {}