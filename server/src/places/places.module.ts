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
import { City } from 'src/cities/models/city.model';
import { ImagesModule } from 'src/images/images.module';
import { Places_TripDays } from 'src/trips-day/models/places-trips-day.model';
import { Places_UnassignedPlaces } from 'src/unassigned-places/models/places-unassigned-places.model';
import { Places_Wishlists } from 'src/wishlists/models/places-wishlist.model';

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
      City,
      Places_TripDays,
      Places_UnassignedPlaces,
      Places_Wishlists,
    ]),
    TagsModule,
    ImagesModule,
  ],
  exports: [PlacesService],
})
export class PlacesModule {}
