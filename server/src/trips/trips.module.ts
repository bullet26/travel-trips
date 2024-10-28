import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { Trip } from './models/trip.model';
import { Images } from 'src/images/models/image.model';

@Module({
  controllers: [TripsController],
  providers: [TripsService],
  imports: [SequelizeModule.forFeature([User, Images, Trip])],
})
export class TripsModule {}
