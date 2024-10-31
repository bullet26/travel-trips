import { IsNumber } from 'class-validator';

export class AddTagDto {
  @IsNumber()
  readonly tagId: number;
}
