import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWishlistDto {
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;
}
