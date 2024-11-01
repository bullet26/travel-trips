import { IsDateString, IsString } from 'class-validator';

export class TransformWLToTripDto {
  @IsString()
  readonly title: string;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly finishDate: Date;
}
