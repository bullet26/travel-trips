import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TripsModule } from './trips/trips.module';
import { TripsDayModule } from './trips-day/trips-day.module';
import { User } from './users/models/users.model';
import { Role } from './roles/models/roles.model';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { RolesGuard } from './auth/guards/role.guard';
import { Images } from './images/models/image.model';
import { Trip } from './trips/models/trip.model';
import { TripDay } from './trips-day/models/trips-day.model';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { PlacesModule } from './places/places.module';
import { TagsModule } from './tags/tags.module';
import { Place } from './places/models/place.model';
import { PlacesTags } from './tags/models/places-tags.model';
import { Tag } from './tags/models/tag.model';
import { WishlistsModule } from './wishlists/wishlists.module';
import { UnassignedPlacesModule } from './unassigned-places/unassigned-places.module';
import { Wishlist } from './wishlists/models/wishlist.model';
import { UnassignedPlaces } from './unassigned-places/models/unassigned-places.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        Images,
        Trip,
        TripDay,
        Place,
        Tag,
        PlacesTags,
        Wishlist,
        UnassignedPlaces,
      ],
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ImagesModule,
    CloudinaryModule,
    TripsModule,
    TripsDayModule,
    PlacesModule,
    TagsModule,
    WishlistsModule,
    UnassignedPlacesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    JwtStrategy,
    CloudinaryProvider,
  ],
})
export class AppModule {}
