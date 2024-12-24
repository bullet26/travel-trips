import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { Country } from './models/country.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { City } from 'src/cities/models/city.model';
import { ensureEntityExists, ensureId } from 'src/utils';
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

    const { file, ...countryData } = createCountryDto;

    const country = await this.countryModel.create(countryData);

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
    });

    return countries;
  }

  async findById(id: number) {
    ensureId(id);

    const country = await this.countryModel.findByPk(id, {
      include: [
        {
          model: Images,
          where: { entityType: EntityType.CITY },
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

    ensureEntityExists({ entity: country, entityName: 'Country', value: id });

    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    ensureId(id);

    const country = await this.countryModel.findByPk(id);
    ensureEntityExists({ entity: country, entityName: 'Country', value: id });

    const { file, ...countryData } = updateCountryDto;

    await country.update(countryData);

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
    ensureId(id);

    const country = await this.countryModel.findByPk(id);
    ensureEntityExists({ entity: country, entityName: 'Country', value: id });

    await country.destroy();
    return { message: 'Country was successfully deleted' };
  }
}
