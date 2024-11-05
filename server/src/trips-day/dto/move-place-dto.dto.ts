import { IsNumber } from 'class-validator';

export class MovePlaceToUnassignedPlacesDto {
  @IsNumber()
  readonly placeId: number;

  @IsNumber()
  readonly unassignedPlacesId: number;
}

export class MovePlaceToTripDayDto {
  @IsNumber()
  readonly placeId: number;

  @IsNumber()
  readonly tripDayId: number;
}
