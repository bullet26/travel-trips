import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly title: string;

  @IsDate()
  readonly startDate: Date;

  @IsDate()
  readonly finishDate: Date;

  @IsString()
  readonly comment?: string;
}
