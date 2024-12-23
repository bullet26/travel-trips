import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  readonly name: string;

  @IsLatitude()
  readonly latitude: number;

  @IsLongitude()
  readonly longitude: number;

  @IsOptional()
  readonly file?: Express.Multer.File;
}
