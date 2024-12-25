import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreatePlaceDto,
  UpdatePlaceDto,
  AddTagDto,
  UpdateTagsDto,
} from './dto';
import { Place } from './models/place.model';
import { Tag, TagsService } from 'src/tags';
import { Images, EntityType, ImagesService } from 'src/images';
import { Transaction } from 'sequelize';
import { City } from 'src/cities/models/city.model';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place) private placeModel: typeof Place,
    private tagService: TagsService,
    private imagesService: ImagesService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const { file, tagIds, ...placeData } = createPlaceDto;

    const transaction: Transaction =
      await this.placeModel.sequelize.transaction();

    try {
      const place = await this.placeModel.create(placeData, { transaction });

      if (tagIds?.length) {
        tagIds.forEach((item) => ensureId(item));

        const validTags = await this.tagService.findGroupByIds(tagIds);
        if (validTags.length !== tagIds.length) {
          throw new BadRequestException('Some tag id do not exist.');
        }

        await place.$add('tags', tagIds, { transaction });
      }

      if (!!file) {
        await this.imagesService.create(
          {
            entityType: EntityType.PLACE,
            entityId: place.id,
            file,
          },
          transaction,
        );
      }

      await transaction.commit();

      return place;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Failed to create: Internal server error',
      );
    }
  }

  async findAll() {
    const places = await this.placeModel.findAll({
      include: [
        {
          model: Images,
          where: { entityType: EntityType.PLACE },
          attributes: ['url', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
      ],
    });
    return places;
  }

  async findAllByCity(cityId: number) {
    ensureId(cityId);

    const places = await this.placeModel.findAll({
      where: { cityId },
      include: {
        model: Images,
        where: { entityType: EntityType.PLACE },
        attributes: ['url', 'id'],
        required: false, // LEFT JOIN вместо INNER JOIN
      },
    });
    return places;
  }

  async findById(id: number, transaction?: Transaction) {
    ensureId(id);

    const place = await this.placeModel.findByPk(id, {
      transaction,
      include: [
        {
          model: Tag,
          through: { attributes: [] }, // Убираем промежуточные атрибуты
          attributes: ['name', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: Images,
          where: { entityType: EntityType.PLACE },
          attributes: ['url', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: City,
          attributes: ['name', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
      ],
    });

    ensureEntityExists({ entity: place, entityName: 'Place', value: id });

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
    const place = await this.findById(id);

    const { file, ...placeData } = updatePlaceDto;

    await place.update(placeData);

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.PLACE,
        entityId: place.id,
        file,
      });
    }

    return place;
  }

  async remove(id: number) {
    const place = await this.findById(id);

    await place.destroy();
    return { message: 'Place was successfully deleted' };
  }

  async updateTags(id: number, UpdateTagsDto: UpdateTagsDto) {
    const { tagIds } = UpdateTagsDto;

    const transaction: Transaction =
      await this.placeModel.sequelize.transaction();

    try {
      tagIds.forEach((item) => ensureId(item));

      const place = await this.findById(id, transaction);

      const currentTagIds = place.tags.map((tag) => tag.id);

      const tagsToAdd = tagIds.filter(
        (tagId) => !currentTagIds.includes(tagId),
      );
      const tagsToRemove = currentTagIds.filter(
        (tagId) => !tagIds.includes(tagId),
      );

      if (tagsToAdd.length) {
        await place.$add('tags', tagsToAdd, { transaction });
      }

      if (tagsToRemove.length) {
        await place.$remove('tags', tagsToRemove, { transaction });
      }

      place.tags = await place.$get('tags', { transaction });

      await transaction.commit();

      return place;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Failed to update tags: Internal server error',
      );
    }
  }

  async addTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    const place = await this.findById(id);

    const tag = await this.tagService.findById(tagId);

    await place.$add('tags', tag.id);
    return place;
  }

  async removeTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    const place = await this.findById(id);

    const tag = await this.tagService.findById(tagId);

    await place.$remove('tags', tag.id);
    return place;
  }
}
