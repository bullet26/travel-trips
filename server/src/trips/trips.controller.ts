import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto } from './dto';
import { Roles } from 'src/auth';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Get('/user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.tripsService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tripsService.findById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(Number(id), updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsService.remove(Number(id));
  }
}
