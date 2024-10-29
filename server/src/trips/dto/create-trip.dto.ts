import { IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly title: string;

  @IsDateString()
  readonly startDate: string;

  @IsDateString()
  readonly finishDate: string;

  @IsString()
  readonly comment: string;
}
