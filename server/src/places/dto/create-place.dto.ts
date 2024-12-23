import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsLatitude()
  readonly latitude: number;

  @IsLongitude()
  readonly longitude: number;

  @IsString()
  readonly address: string;

  readonly file?: Express.Multer.File;
}
