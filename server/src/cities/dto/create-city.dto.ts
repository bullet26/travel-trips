import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCityDto {
  @Type(() => Number)
  @IsNumber()
  readonly countryId: number;

  @IsString()
  readonly name: string;

  @Type(() => Number)
  @IsLatitude()
  readonly latitude: number;

  @Type(() => Number)
  @IsLongitude()
  readonly longitude: number;

  @IsOptional()
  readonly file?: Express.Multer.File;
}
