import { IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly coordinates: string;

  @IsString()
  readonly address: string;
}
