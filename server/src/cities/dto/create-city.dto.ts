import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNumber()
  readonly countryId: number;

  @IsString()
  readonly name: string;

  @IsLatitude()
  readonly latitude: number;

  @IsLongitude()
  readonly longitude: number;

  readonly file?: Express.Multer.File;
}
