import { IsNumber, IsString } from 'class-validator';

export class LinkGoogleDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly providerId: string;
}
