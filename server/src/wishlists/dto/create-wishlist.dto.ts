import { IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly comment?: string;
}
