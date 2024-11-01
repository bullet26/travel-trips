import { IsDateString, IsNumber } from 'class-validator';

export class CreateTripsDayDto {
  @IsNumber()
  readonly tripId: number;

  @IsDateString()
  readonly date: Date;
}
