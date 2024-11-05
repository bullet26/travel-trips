import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UnassignedPlacesService } from './unassigned-places.service';
import { AddPlaceDto, MovePlaceToTripDayDto } from 'src/trips-day/dto';

@Controller('unassigned-places')
export class UnassignedPlacesController {
  constructor(
    private readonly unassignedPlacesService: UnassignedPlacesService,
  ) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.unassignedPlacesService.findById(Number(id));
  }

  @Patch('/place/add/:id')
  addPlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.unassignedPlacesService.addPlace(Number(id), addPlaceDto);
  }

  @Patch('/place/remove/:id')
  removePlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.unassignedPlacesService.removePlace(Number(id), addPlaceDto);
  }

  @Patch('/place/move/:id')
  movePlaceToTripDay(
    @Param('id') id: string,
    @Body() movePlaceToTripDayDto: MovePlaceToTripDayDto,
  ) {
    return this.unassignedPlacesService.movePlaceToTripDay(
      Number(id),
      movePlaceToTripDayDto,
    );
  }
}
