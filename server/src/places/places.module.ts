import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { Place } from './models/place.model';
import { Tag, PlacesTags, TagsModule } from 'src/tags';
import { Images } from 'src/images/models/image.model';
import { Wishlist } from 'src/wishlists/models/wishlist.model';
import { UnassignedPlaces } from 'src/unassigned-places/models/unassigned-places.model';
import { TripDay } from 'src/trips-day/models/trips-day.model';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [
    SequelizeModule.forFeature([
      TripDay,
      Place,
      Tag,
      PlacesTags,
      Images,
      Wishlist,
      UnassignedPlaces,
    ]),
    TagsModule,
  ],
  exports: [PlacesService],
})
export class PlacesModule {}
