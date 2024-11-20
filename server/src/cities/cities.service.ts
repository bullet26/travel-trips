import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCityDto, UpdateCityDto } from './dto';
import { City } from './models/city.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { Place } from 'src/places/models/place.model';
import { Country } from 'src/countries/models/country.model';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City) private cityModel: typeof City) {}

  async create(createCityDto: CreateCityDto) {
    const city = await this.cityModel.create(createCityDto);
    return city;
  }

  async findAll() {
    const cities = await this.cityModel.findAll({
      include: {
        model: Images,
        where: { entityType: EntityType.CITY },
        attributes: ['url'],
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
          attributes: ['url'],
        },
        {
          model: Place,
          attributes: ['name'],
        },
        {
          model: Country,
          attributes: ['name'],
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

    await city.update(updateCityDto);
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
