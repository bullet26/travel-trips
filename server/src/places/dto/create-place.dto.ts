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
import { transformArrayInFormData } from 'src/utils';

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
  @Transform(({ value }) => transformArrayInFormData(value))
  @IsArray()
  @IsNumber({}, { each: true })
  readonly tagIds?: string[] | string;

  @IsArray()
  @ArrayNotEmpty()
  translations: string[];

  @IsOptional()
  @IsArray()
  synonyms: string[];
}
//tagIds- данные в formData всегла строки, а id должны быть number[], поэтому сначала преобразов данные через Transform, а потом провкряем
// на фроонте должен формироваться string[], но кейс string тоже обрабатывается
