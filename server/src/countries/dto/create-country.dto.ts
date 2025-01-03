import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCountryDto {
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

  @IsArray()
  @ArrayNotEmpty()
  translations: string[];
}
