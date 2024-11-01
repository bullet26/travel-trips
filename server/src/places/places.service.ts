import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './models/place.model';
import { Tag } from 'src/tags/models/tag.model';
import { AddTagDto } from './dto/add-tag-dto.dto';
import { TagsService } from 'src/tags/tags.service';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';

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

  async findById(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const place = await this.placeModel.findByPk(id, {
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

  async findAllByWishlistId(wishlistId: number) {
    const places = await this.placeModel.findAll({ where: { wishlistId } });
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
