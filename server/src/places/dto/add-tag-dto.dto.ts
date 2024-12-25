import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class AddTagDto {
  @IsNumber()
  readonly tagId: number;
}

export class UpdateTagsDto {
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  readonly tagIds: number[];
}
