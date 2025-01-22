import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnassignedPlacesService } from './unassigned-places.service';
import { Trip } from 'src/trips/models/trip.model';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place } from 'src/places/models/place.model';
import { PlacesModule } from 'src/places/places.module';
import { TripsDayModule } from 'src/trips-day/trips-day.module';
import { UnassignedPlacesController } from './unassigned-places.controller';
import { Places_UnassignedPlaces } from './models/places-unassigned-places.model';

@Module({
  controllers: [UnassignedPlacesController],
  providers: [UnassignedPlacesService],
  imports: [
    SequelizeModule.forFeature([
      Trip,
      UnassignedPlaces,
      Place,
      Places_UnassignedPlaces,
    ]),
    forwardRef(() => TripsDayModule),
    PlacesModule,
  ],
  exports: [UnassignedPlacesService],
})
export class UnassignedPlacesModule {}
