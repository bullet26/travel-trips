import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTripDto, UpdateTripDto } from './dto';
import { Trip } from './models/trip.model';
import { Images, EntityType, ImagesService } from 'src/images';
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
    private imagesService: ImagesService,
  ) {}

  async create(createTripDto: CreateTripDto, transaction?: Transaction) {
    const { startDate, finishDate } = createTripDto;

    if (finishDate.getTime() <= startDate.getTime()) {
      throw new BadRequestException(
        'The end date of the trip must be later than the start date.',
      );
    }

    const { file, ...tripData } = createTripDto;

    const trip = await this.tripModel.create(tripData, { transaction });

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

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.TRIP,
        entityId: trip.id,
        file,
      });
    }

    return trip;
  }

  async findAll() {
    const trips = await this.tripModel.findAll({
      include: {
        model: Images,
        where: { entityType: EntityType.TRIP },
        attributes: ['url'],
        required: false, // LEFT JOIN вместо INNER JOIN
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
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: UnassignedPlaces,
          attributes: ['id'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: TripDay,
          attributes: ['id', 'date'],
          required: false, // LEFT JOIN вместо INNER JOIN
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
        required: false, // LEFT JOIN вместо INNER JOIN
      },
    });
    return trips;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    const trip = await this.findById(id);

    const { file, ...tripData } = updateTripDto;

    await trip.update(tripData);

    if (!!file) {
      await this.imagesService.create({
        entityType: EntityType.TRIP,
        entityId: trip.id,
        file,
      });
    }

    return trip;
  }

  async remove(id: number) {
    const trip = await this.findById(id);

    await trip.destroy();

    await Promise.all([
      this.unassignedPlacesService.findByTripIdAndRemove(id),
      this.tripsDayService.removeAllByTripId(id),
    ]);

    return { message: 'Trip and related entities successfully deleted' };
  }
}
