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
import { Roles } from 'src/auth';
import {
  MovePlaceToUnassignedPlacesDto,
  AddPlaceDto,
  UpdateTripsDayDto,
  CreateTripsDayDto,
  MovePlaceToTripDayDto,
} from './dto';

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
  findAllByTrip(@Param('tripId') tripId: string) {
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
    return this.tripsDayService.unlinkPlace(Number(id), addPlaceDto);
  }

  @Patch('/place/move/up/:id')
  movePlaceToUnassignedPlaces(
    @Param('id') id: string,
    @Body() movePlaceToUnassignedPlacesDto: MovePlaceToUnassignedPlacesDto,
  ) {
    return this.tripsDayService.movePlaceToUnassignedPlaces(
      Number(id),
      movePlaceToUnassignedPlacesDto,
    );
  }

  @Patch('/place/move/td/:id')
  movePlaceToAnotherTripDay(
    @Param('id') id: string,
    @Body() movePlaceToTripDayDto: MovePlaceToTripDayDto,
  ) {
    return this.tripsDayService.movePlaceToAnotherTripDay(
      Number(id),
      movePlaceToTripDayDto,
    );
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
    return this.tripsDayService.remove(Number(id));
  }
}
