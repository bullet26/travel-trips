import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCityDto, UpdateCityDto } from './dto';
import { City } from './models/city.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { Place } from 'src/places/models/place.model';
import { Country } from 'src/countries/models/country.model';
import {
  ensureEntityExists,
  ensureId,
  generateTsvector,
  shouldUpdateTsvector,
} from 'src/utils';
import { ImagesService } from 'src/images';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City) private cityModel: typeof City,
    private imagesService: ImagesService,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const cityInDB = await this.cityModel.findOne({
      where: {
        name: createCityDto.name,
      },
    });

    if (cityInDB) {
      throw new BadRequestException(
        `This city (${cityInDB.name}) already created`,
      );
    }

    const { file, name, translations, ...cityData } = createCityDto;
    const tsvectorField = await generateTsvector({ name, translations });

    const city = await this.cityModel.create({
      ...cityData,
      name,
      translations,
      tsvectorField,
    });

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.CITY,
        entityId: city.id,
        file,
      });
    }

    return city;
  }

  async findAll() {
    const cities = await this.cityModel.findAll({
      attributes: { exclude: ['tsvectorField'] },
      include: {
        model: Images,
        where: { entityType: EntityType.CITY },
        attributes: ['url', 'id'],
        required: false, // LEFT JOIN вместо INNER JOIN
      },
      order: [['name', 'ASC']],
    });
    return cities;
  }

  async findById(id: number) {
    ensureId(id);

    const city = await this.cityModel.findByPk(id, {
      attributes: { exclude: ['tsvectorField'] },
      include: [
        {
          model: Images,
          where: { entityType: EntityType.CITY },
          attributes: ['url', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: Place,
          attributes: ['name', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
          include: [
            {
              model: Images,
              where: { entityType: EntityType.PLACE },
              attributes: ['url', 'id'],
              required: false, // LEFT JOIN вместо INNER JOIN
            },
          ],
        },
        {
          model: Country,
          attributes: ['name', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
      ],
    });

    ensureEntityExists({ entity: city, entityName: 'City', value: id });

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findById(id);

    const { file, name, translations, ...cityData } = updateCityDto;
    let tsvectorField = city.tsvectorField;

    if (shouldUpdateTsvector({ name, translations, itemFromDB: city })) {
      tsvectorField = await generateTsvector({
        name: name || city.name,
        translations: translations || city.translations,
      });
    }
    await city.update({ ...cityData, name, translations, tsvectorField });

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.CITY,
        entityId: city.id,
        file,
      });
    }

    return city;
  }

  async remove(id: number) {
    const city = await this.findById(id);

    await city.destroy();
    return { message: 'City was successfully deleted' };
  }
}
