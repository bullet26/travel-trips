import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { Places_Wishlists, Wishlist, WishlistsModule } from './wishlists';
import { User, UsersModule } from './users';
import { Role, RolesModule } from './roles';
import { Images, ImagesModule } from './images';
import { Trip, TripsModule } from './trips';
import { Places_TripDays, TripDay, TripsDayModule } from './trips-day';
import { Place, PlacesModule } from './places';
import { PlacesTags, Tag, TagsModule } from './tags';
import {
  Places_UnassignedPlaces,
  UnassignedPlaces,
  UnassignedPlacesModule,
} from './unassigned-places';
import { AuthModule, JwtAuthGuard, JwtStrategy, RolesGuard } from './auth';
import { CloudinaryModule, CloudinaryProvider } from './cloudinary';
import { CitiesModule, City } from './cities';
import { CountriesModule, Country } from './countries';
import { RootModule } from './root';
import { SearchModule } from './search';

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
        Places_TripDays,
        Place,
        Tag,
        PlacesTags,
        Wishlist,
        Places_Wishlists,
        UnassignedPlaces,
        Places_UnassignedPlaces,
        City,
        Country,
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
    CitiesModule,
    CountriesModule,
    RootModule,
    SearchModule,
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
