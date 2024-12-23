import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePlaceDto, UpdatePlaceDto, AddTagDto } from './dto';
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
    const { file, ...placeData } = createPlaceDto;

    const place = await this.placeModel.create(placeData);

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.PLACE,
        entityId: place.id,
        file,
      });
    }
    return place;
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
          attributes: ['name'],
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
          attributes: ['name'],
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
    ensureId(id);

    const place = await this.placeModel.findByPk(id);
    ensureEntityExists({ entity: place, entityName: 'Place', value: id });

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
    ensureId(id);

    const place = await this.placeModel.findByPk(id);
    ensureEntityExists({ entity: place, entityName: 'Place', value: id });

    await place.destroy();
    return { message: 'Place was successfully deleted' };
  }

  async addTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    ensureId(id);
    ensureId(tagId);

    const place = await this.placeModel.findByPk(id);
    ensureEntityExists({ entity: place, entityName: 'Place', value: id });

    const tag = await this.tagService.findById(tagId);
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: tagId });

    await place.$add('tags', tag.id);
    return place;
  }

  async removeTag(id: number, AddPlaceDto: AddTagDto) {
    const { tagId } = AddPlaceDto;

    ensureId(id);
    ensureId(tagId);

    const place = await this.placeModel.findByPk(id);
    ensureEntityExists({ entity: place, entityName: 'Place', value: id });

    const tag = await this.tagService.findById(tagId);
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: tagId });

    await place.$remove('tags', tag.id);
    return place;
  }
}
