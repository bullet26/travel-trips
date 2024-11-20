import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  readonly name: string;

  @IsLatitude()
  readonly latitude: number;

  @IsLongitude()
  readonly longitude: number;
}
