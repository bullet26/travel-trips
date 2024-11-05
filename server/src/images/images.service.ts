import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CloudinaryService } from 'src/cloudinary';
import { Images } from './models/image.model';
import { EntityType } from './types/EntityType';
import { validateEntityExists } from './utils/entityValidator.util';
import { SetImgToEntityDto, CreateImageDto } from './dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Images) private imageModel: typeof Images,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createImageDto: CreateImageDto) {
    const { entityType, entityId, file } = createImageDto;

    if (!entityType || !entityId) {
      throw new BadRequestException(
        `Set entityType (one of: ${Object.values(EntityType).join(', ')}) and entityId for link`,
      );
    }
    await validateEntityExists(entityType, entityId);

    const uploadResult = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
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
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }
    return image;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }
    await image.destroy();
  }

  async setImgToEntity(id: number, setImgToEntityDto: SetImgToEntityDto) {
    const { entityId, entityType } = setImgToEntityDto;

    if (!entityType || !entityId) {
      throw new BadRequestException(
        `Set entityType (one of: ${Object.values(EntityType).join(', ')}) and entityId for link`,
      );
    }

    await validateEntityExists(entityType, entityId);

    const image = await this.imageModel.findByPk(id);

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    await image.update({ entityType, entityId });
    return image;
  }
}
