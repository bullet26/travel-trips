import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Trip } from './models/trip.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip) private tripModel: typeof Trip) {}

  async create(createTripDto: CreateTripDto) {
    const trip = await this.tripModel.create(createTripDto);
    return trip;
  }

  async findAll() {
    const trips = await this.tripModel.findAll({
      include: {
        model: Images,
        where: { entityType: EntityType.TRIP },
        attributes: ['url'],
      },
    });
    return trips;
  }

  async findById(id: number) {
    const trip = await this.tripModel.findByPk(id, {
      include: {
        model: Images,
        where: { entityType: EntityType.TRIP },
        attributes: ['url'],
      },
    });
    return trip;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    const trip = await this.tripModel.findByPk(id);

    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }

    await trip.update(updateTripDto);
    return trip;
  }

  async remove(id: number) {
    const trip = await this.tripModel.findByPk(id);
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }
    await trip.destroy();
  }
}
