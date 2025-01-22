import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './models/wishlist.model';
import { User } from 'src/users/models/users.model';
import { TripsModule } from 'src/trips/trips.module';
import { UnassignedPlacesModule } from 'src/unassigned-places/unassigned-places.module';
import { Place } from 'src/places/models/place.model';
import { PlacesModule } from 'src/places/places.module';
import { Places_Wishlists } from './models/places-wishlist.model';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [
    SequelizeModule.forFeature([Wishlist, User, Place, Places_Wishlists]),
    PlacesModule,
    TripsModule,
    UnassignedPlacesModule,
  ],
})
export class WishlistsModule {}
