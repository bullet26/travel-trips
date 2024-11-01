import { IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly title: string;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly finishDate: Date;

  @IsString()
  readonly comment?: string;
}
