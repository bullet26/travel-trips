import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTripDto, UpdateTripDto } from './dto';
import { Trip } from './models/trip.model';
import { Images, EntityType } from 'src/images';
import { TripDay, TripsDayService } from 'src/trips-day';
import {
  UnassignedPlaces,
  UnassignedPlacesService,
} from 'src/unassigned-places';
import { Transaction } from 'sequelize';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip) private tripModel: typeof Trip,
    private tripsDayService: TripsDayService,
    private unassignedPlacesService: UnassignedPlacesService,
  ) {}

  async create(createTripDto: CreateTripDto, transaction?: Transaction) {
    const { startDate, finishDate } = createTripDto;

    if (finishDate.getTime() <= startDate.getTime()) {
      throw new BadRequestException(
        'The end date of the trip must be later than the start date.',
      );
    }

    const trip = await this.tripModel.create(createTripDto, { transaction });

    let currentDate = new Date(startDate);
    const createDayPromises = [];

    while (currentDate.getTime() <= finishDate.getTime()) {
      createDayPromises.push(
        this.tripsDayService.create(
          {
            date: new Date(currentDate),
            tripId: trip.id,
          },
          transaction,
        ),
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await Promise.all(createDayPromises);

    await this.unassignedPlacesService.create({ tripId: trip.id }, transaction);

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
    ensureId(id);

    const trip = await this.tripModel.findByPk(id, {
      include: [
        {
          model: Images,
          where: { entityType: EntityType.TRIP },
          attributes: ['url'],
        },
        {
          model: UnassignedPlaces,
          attributes: ['id'],
        },
        {
          model: TripDay,
          attributes: ['id', 'date'],
        },
      ],
    });

    ensureEntityExists({ entity: trip, entityName: 'Trip', value: id });

    return trip;
  }

  async findAllByUser(userId: number) {
    ensureId(userId);

    const trips = await this.tripModel.findAll({
      where: { userId },
      include: {
        model: Images,
        where: { entityType: EntityType.TRIP },
        attributes: ['url'],
      },
    });
    return trips;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    ensureId(id);

    const trip = await this.tripModel.findByPk(id);
    ensureEntityExists({ entity: trip, entityName: 'Trip', value: id });

    await trip.update(updateTripDto);
    return trip;
  }

  async remove(id: number) {
    ensureId(id);

    const trip = await this.tripModel.findByPk(id);
    ensureEntityExists({ entity: trip, entityName: 'Trip', value: id });

    await trip.destroy();

    await Promise.all([
      this.unassignedPlacesService.findByTripIdAndRemove(id),
      this.tripsDayService.removeAllByTripId(id),
    ]);

    return { message: 'Trip and related entities successfully deleted' };
  }
}
