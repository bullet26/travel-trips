import { IsNumber } from 'class-validator';

export class AddPlaceDto {
  @IsNumber()
  readonly placeId: number;
}
