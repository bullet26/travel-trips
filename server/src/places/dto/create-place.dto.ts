import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlaceDto {
  @Type(() => Number)
  @IsNumber()
  readonly cityId: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @Type(() => Number)
  @IsLatitude()
  readonly latitude: number;

  @Type(() => Number)
  @IsLongitude()
  readonly longitude: number;

  @IsString()
  readonly address: string;

  @IsOptional()
  readonly file?: Express.Multer.File;
}
