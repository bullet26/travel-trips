import { IsDateString, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  finishDate: string;

  @IsString()
  comment: string;
}
