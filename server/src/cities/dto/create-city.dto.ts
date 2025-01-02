import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
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

  @IsArray()
  @ArrayNotEmpty()
  translations: string[];

  @IsOptional()
  @IsArray()
  synonyms: string[];
}
