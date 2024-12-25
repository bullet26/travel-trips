import { Transform, Type } from 'class-transformer';
import {
  IsArray,
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

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => Number(v)) : value,
  )
  @IsArray()
  @IsNumber({}, { each: true })
  readonly tagIds?: number[];
}
