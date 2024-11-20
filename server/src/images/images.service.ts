import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CloudinaryService } from 'src/cloudinary';
import { Images } from './models/image.model';
import { EntityType } from './types/EntityType';
import { validateEntityExists } from './utils/entityValidator.util';
import { SetImgToEntityDto, CreateImageDto } from './dto';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Images) private imageModel: typeof Images,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createImageDto: CreateImageDto) {
    const { entityType, entityId, file } = createImageDto;

    ensureId(entityId);
    if (!entityType) {
      throw new BadRequestException(
        `Set entityType (one of: ${Object.values(EntityType).join(', ')}) for link`,
      );
    }
    await validateEntityExists(entityType, entityId);

    const uploadResult = await this.cloudinary
      .uploadImage(file)
      .catch((error) => {
        throw new InternalServerErrorException(
          `Image upload failed: ${error.message}`,
        );
      });

    return this.imageModel.create({
      url: uploadResult.secure_url,
      entityType: entityType,
      entityId,
    });
  }

  async findAll() {
    const images = await this.imageModel.findAll();
    return images;
  }

  async findById(id: number) {
    ensureId(id);

    const image = await this.imageModel.findByPk(id);
    ensureEntityExists({ entity: image, entityName: 'Image', value: id });

    return image;
  }

  async remove(id: number) {
    ensureId(id);

    const image = await this.imageModel.findByPk(id);
    ensureEntityExists({ entity: image, entityName: 'Image', value: id });

    await image.destroy();
    return { message: 'Image was successfully deleted' };
  }

  async setImgToEntity(id: number, setImgToEntityDto: SetImgToEntityDto) {
    const { entityId, entityType } = setImgToEntityDto;

    ensureId(entityId);
    if (!entityType) {
      throw new BadRequestException(
        `Set entityType (one of: ${Object.values(EntityType).join(', ')}) for link`,
      );
    }

    await validateEntityExists(entityType, entityId);

    const image = await this.imageModel.findByPk(id);
    ensureEntityExists({ entity: image, entityName: 'Image', value: id });

    await image.update({ entityType, entityId });
    return image;
  }
}
