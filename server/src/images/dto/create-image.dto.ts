import { EntityType } from '../types/EntityType';

export class CreateImageDto {
  readonly file: Express.Multer.File;

  readonly entityType: EntityType;

  readonly entityId: number;

  readonly cloudinaryPublicId?: string;
}
