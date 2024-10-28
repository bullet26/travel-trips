import { IsNumber } from 'class-validator';
import { EntityType } from '../types/EntityType';

export class CreateImageDto {
  file: Express.Multer.File;

  entityType: EntityType;

  @IsNumber()
  entityId: number;
}
