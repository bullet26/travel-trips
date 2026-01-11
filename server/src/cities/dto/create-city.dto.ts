import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { transformStringToArrayInFormData } from 'src/utils/transform';

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

  @Transform(({ value }) => transformStringToArrayInFormData(value))
  @IsArray()
  @ArrayNotEmpty()
  translations: string[];
}
