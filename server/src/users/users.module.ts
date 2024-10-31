import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/models/roles.model';
import { User } from './models/users.model';
import { Trip } from 'src/trips/models/trip.model';
import { Wishlist } from 'src/wishlists/models/wishlist.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, Trip, Wishlist]),
    RolesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
