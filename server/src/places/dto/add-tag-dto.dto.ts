import { IsArray, IsNumber } from 'class-validator';

export class AddTagDto {
  @IsNumber()
  readonly tagId: number;
}

export class UpdateTagsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  readonly tagIds: number[];
}
