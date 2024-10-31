import { IsNumber } from 'class-validator';

export class CreateUnassignedPlaceDto {
  @IsNumber()
  readonly tripId: number;
}
