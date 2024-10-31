import { IsNumber } from 'class-validator';
import { EntityType } from '../types/EntityType';

export class SetImgToEntityDto {
  @IsNumber()
  readonly entityId: number;

  readonly entityType: EntityType;
}
