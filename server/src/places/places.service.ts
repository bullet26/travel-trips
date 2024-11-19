import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePlaceDto, UpdatePlaceDto, AddTagDto } from './dto';
import { Place } from './models/place.model';
import { Tag, TagsService } from 'src/tags';
import { Images, EntityType } from 'src/images';
import { Transaction } from 'sequelize';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place) private placeModel: typeof Place,
    private tagService: TagsService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const place = await this.placeModel.create(createPlaceDto);
    return place;
  }

  async findAll() {
    const places = await this.placeModel.findAll();
    return places;
  }

  async findById(id: number, transaction?: Transaction) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id, {
      transaction,
      include: [
        {
          model: Tag,
          through: { attributes: [] }, // Убираем промежуточные атрибуты
          attributes: ['name'],
        },
        {
          model: Images,
          where: { entityType: EntityType.PLACE },
          attributes: ['url'],
        },
      ],
    });
    return place;
  }

  async findAllByWishlistId(wishlistId: number, transaction?: Transaction) {
    const places = await this.placeModel.findAll({
      where: { wishlistId },
      transaction,
    });
    return places;
  }

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id);

    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    await place.update(updatePlaceDto);
    return place;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id);
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    await place.destroy();
  }

  async addTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    if (!tagId || !id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id);
    const tag = await this.tagService.findById(tagId);

    if (!tag) {
      throw new NotFoundException(`Tag not found by ${tagId}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${id}`);
    }

    await place.$add('tags', tag.id);
    return place;
  }

  async removeTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    if (!tagId || !id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id);
    const tag = await this.tagService.findById(tagId);

    if (!tag) {
      throw new NotFoundException(`Tag not found by ${tagId}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${id}`);
    }

    await place.$remove('tags', tag.id);
    return place;
  }
}
