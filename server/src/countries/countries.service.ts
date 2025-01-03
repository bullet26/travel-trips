import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { Country } from './models/country.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { City } from 'src/cities/models/city.model';
import {
  ensureEntityExists,
  ensureId,
  generateTsvector,
  shouldUpdateTsvector,
} from 'src/utils';
import { ImagesService } from 'src/images';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country) private countryModel: typeof Country,
    private imagesService: ImagesService,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const countryInDB = await this.countryModel.findOne({
      where: {
        name: createCountryDto.name,
      },
    });

    if (countryInDB) {
      throw new BadRequestException(
        `This country (${countryInDB.name}) already created`,
      );
    }

    const { file, name, translations, ...countryData } = createCountryDto;
    const tsvectorField = await generateTsvector({ name, translations });

    const country = await this.countryModel.create({
      ...countryData,
      name,
      translations,
      tsvector_field: tsvectorField,
    });

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.COUNTRY,
        entityId: country.id,
        file,
      });
    }

    return country;
  }

  async findAll() {
    const countries = await this.countryModel.findAll({
      attributes: { exclude: ['tsvectorField'] },
      include: [
        {
          model: Images,
          where: { entityType: EntityType.COUNTRY },
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

    return countries;
  }

  async findById(id: number) {
    ensureId(id);

    const country = await this.countryModel.findByPk(id, {
      attributes: { exclude: ['tsvectorField'] },
      include: [
        {
          model: Images,
          where: { entityType: EntityType.COUNTRY },
          attributes: ['url', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: City,
          attributes: ['name', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
          include: [
            {
              model: Images,
              where: { entityType: EntityType.CITY },
              attributes: ['url', 'id'],
              required: false, // LEFT JOIN вместо INNER JOIN
            },
          ],
        },
      ],
    });

    ensureEntityExists({ entity: country, entityName: 'Country', value: id });

    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findById(id);

    const { file, name, translations, ...countryData } = updateCountryDto;
    let tsvectorField = country.tsvector_field;

    if (shouldUpdateTsvector({ name, translations, itemFromDB: country })) {
      tsvectorField = await generateTsvector({
        name: name || country.name,
        translations: translations || country.translations,
      });
    }

    await country.update({
      ...countryData,
      name,
      translations,
      tsvector_field: tsvectorField,
    });

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.COUNTRY,
        entityId: id,
        file,
      });
    }

    return country;
  }

  async remove(id: number) {
    const country = await this.findById(id);

    await country.destroy();
    return { message: 'Country was successfully deleted' };
  }
}
