import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateTripDto {
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly title: string;

  @Type(() => Date)
  @IsDate()
  readonly startDate: Date;

  @Type(() => Date)
  @IsDate()
  readonly finishDate: Date;

  @IsOptional()
  @IsString()
  readonly comment?: string;

  @IsOptional()
  readonly file?: Express.Multer.File;
}
