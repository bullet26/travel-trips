import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { User } from 'src/users/models/users.model';
import { Place } from 'src/places/models/place.model';
import { Wishlist } from './models/wishlist.model';
import { TripsModule } from 'src/trips/trips.module';
import { PlacesModule } from 'src/places/places.module';
import { UnassignedPlacesModule } from 'src/unassigned-places/unassigned-places.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [
    SequelizeModule.forFeature([Wishlist, User, Place]),
    PlacesModule,
    TripsModule,
    UnassignedPlacesModule,
  ],
})
export class WishlistsModule {}
