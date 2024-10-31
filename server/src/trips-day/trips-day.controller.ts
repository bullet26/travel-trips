import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TripsDayService } from './trips-day.service';
import { CreateTripsDayDto } from './dto/create-trips-day.dto';
import { UpdateTripsDayDto } from './dto/update-trips-day.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AddPlaceDto } from './dto/add-place-dto.dto';

@Controller('trips-day')
export class TripsDayController {
  constructor(private readonly tripsDayService: TripsDayService) {}

  @Post()
  create(@Body() createTripsDayDto: CreateTripsDayDto) {
    return this.tripsDayService.create(createTripsDayDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.tripsDayService.findAll();
  }

  @Get('/trip/:tripId')
  findAllByUser(@Param('tripId') tripId: string) {
    return this.tripsDayService.findAllByTrip(Number(tripId));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tripsDayService.findById(Number(id));
  }

  @Patch('/place/add/:id')
  addPlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.tripsDayService.addPlace(Number(id), addPlaceDto);
  }

  @Patch('/place/remove/:id')
  removePlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.tripsDayService.removePlace(Number(id), addPlaceDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTripsDayDto: UpdateTripsDayDto,
  ) {
    return this.tripsDayService.update(Number(id), updateTripsDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsDayService.remove(+id);
  }
}
