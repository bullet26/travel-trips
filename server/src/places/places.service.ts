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
import {
  ensureEntityExists,
  ensureId,
  generateTsvector,
  shouldUpdateTsvector,
  transformArrayInFormData,
} from 'src/utils';
import { Wishlist } from 'src/wishlists/models/wishlist.model';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place) private placeModel: typeof Place,
    private tagService: TagsService,
    private imagesService: ImagesService,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const {
      file,
      name,
      translations,
      tagIds: tagValues,
      ...placeData
    } = createPlaceDto;

    const transaction: Transaction =
      await this.placeModel.sequelize.transaction();

    try {
      const tsvectorField = await generateTsvector({ name, translations });

      const place = await this.placeModel.create(
        {
          ...placeData,
          name,
          translations,
          tsvector_field: tsvectorField,
        },
        { transaction },
      );

      if (tagValues) {
        const tagIds = transformArrayInFormData(tagValues);

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
      attributes: { exclude: ['tsvector_field'] },
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
      order: [['name', 'ASC']],
    });
    return places;
  }

  async findAllByCity(cityId: number) {
    ensureId(cityId);

    const places = await this.placeModel.findAll({
      where: { cityId },
      attributes: { exclude: ['tsvector_field'] },
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
      ],
      order: [['name', 'ASC']],
    });
    return places;
  }

  async findById(id: number, transaction?: Transaction) {
    ensureId(id);

    const place = await this.placeModel.findByPk(id, {
      transaction,
      attributes: { exclude: ['tsvector_field'] },
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
      include: [
        {
          model: Wishlist,
          where: { id: wishlistId },
          through: { attributes: [] }, // Исключаем данные из промежуточной таблицы
        },
      ],
      attributes: { exclude: ['tsvector_field'] },
      order: [['name', 'ASC']],
      transaction,
    });
    return places;
  }

  async remove(id: number) {
    ensureId(id);

    await this.placeModel.destroy({ where: { id } });
    return { message: 'Place was successfully deleted' };
  }

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    const transaction: Transaction =
      await this.placeModel.sequelize.transaction();

    try {
      const {
        file,
        name,
        translations,
        tagIds = [],
        ...placeData
      } = updatePlaceDto;

      let place = await this.findById(id, transaction);
      let tsvectorField = place.tsvector_field;

      if (shouldUpdateTsvector({ name, translations, itemFromDB: place })) {
        tsvectorField = await generateTsvector({
          name: name || place.name,
          translations: translations || place.translations,
        });
      }

      await place.update(
        { ...placeData, name, translations, tsvector_field: tsvectorField },
        { transaction },
      );

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

      if (tagIds) {
        place = await this.updateTags(
          id,
          { tagIds: transformArrayInFormData(tagIds) },
          transaction,
        );
      }

      await transaction.commit();

      return place;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Failed to update tags: Internal server error',
      );
    }
  }

  async updateTags(
    id: number,
    updateTagsDto: UpdateTagsDto,
    transaction?: Transaction,
  ) {
    const { tagIds } = updateTagsDto;

    tagIds.forEach((item) => ensureId(item));

    const place = await this.findById(id, transaction);

    const currentTagIds = place.tags.map((tag) => tag.id);

    const tagsToAdd = tagIds.filter((tagId) => !currentTagIds.includes(tagId));
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

    return place;
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
