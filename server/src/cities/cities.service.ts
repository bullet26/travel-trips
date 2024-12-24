import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCityDto, UpdateCityDto } from './dto';
import { City } from './models/city.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { Place } from 'src/places/models/place.model';
import { Country } from 'src/countries/models/country.model';
import { ensureEntityExists, ensureId } from 'src/utils';
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

    const { file, ...cityData } = createCityDto;

    const city = await this.cityModel.create(cityData);

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
      include: {
        model: Images,
        where: { entityType: EntityType.CITY },
        attributes: ['url', 'id'],
        required: false, // LEFT JOIN вместо INNER JOIN
      },
    });
    return cities;
  }

  async findById(id: number) {
    ensureId(id);

    const city = await this.cityModel.findByPk(id, {
      include: [
        {
          model: Images,
          where: { entityType: EntityType.CITY },
          attributes: ['url', 'id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: Place,
          attributes: ['name'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: Country,
          attributes: ['name'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
      ],
    });

    ensureEntityExists({ entity: city, entityName: 'City', value: id });

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    ensureId(id);

    const city = await this.cityModel.findByPk(id);
    ensureEntityExists({ entity: city, entityName: 'City', value: id });

    const { file, ...cityData } = updateCityDto;

    await city.update(cityData);

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
    ensureId(id);

    const city = await this.cityModel.findByPk(id);
    ensureEntityExists({ entity: city, entityName: 'City', value: id });

    await city.destroy();
    return { message: 'City was successfully deleted' };
  }
}
