import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { ensureEntityExists, ensureId, normalizeDate } from 'src/utils';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip) private tripModel: typeof Trip,
    private tripsDayService: TripsDayService,
    private unassignedPlacesService: UnassignedPlacesService,
    private imagesService: ImagesService,
  ) {}

  async create(createTripDto: CreateTripDto, transaction?: Transaction) {
    const {
      file,
      startDate: startDateString,
      finishDate: finishDateString,
      ...tripData
    } = createTripDto;

    const finishDate = normalizeDate(finishDateString);
    const startDate = normalizeDate(startDateString);

    if (finishDate.getTime() <= startDate.getTime()) {
      throw new BadRequestException(
        'The end date of the trip must be later than the start date.',
      );
    }

    const trip = await this.tripModel.create(
      { ...tripData, startDate, finishDate },
      { transaction },
    );

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
      order: [['startDate', 'DESC']],
    });
    return trips;
  }

  async findById(id: number, transaction?: Transaction) {
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
          as: 'tripDays',
          attributes: ['id', 'date'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
      ],
      order: [[{ model: TripDay, as: 'tripDays' }, 'date', 'ASC']],
      transaction,
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
      order: [['startDate', 'DESC']],
    });
    return trips;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    const transaction: Transaction =
      await this.tripModel.sequelize.transaction();

    try {
      const trip = await this.findById(id, transaction);

      const {
        file,
        startDate: startDateString,
        finishDate: finishDateString,
        ...tripData
      } = updateTripDto;

      const finishDate = normalizeDate(finishDateString);
      const startDate = normalizeDate(startDateString);

      if (finishDate.getTime() <= startDate.getTime()) {
        throw new BadRequestException(
          'The end date of the trip must be later than the start date.',
        );
      }

      if (
        finishDate.getTime() !== trip.finishDate.getTime() ||
        startDate.getTime() !== trip.startDate.getTime()
      ) {
        const existingTripDays = await this.tripsDayService.findAllByTrip(
          trip.id,
          transaction,
        );

        const daysToRemove = existingTripDays.filter(
          (day) =>
            day.date.getTime() < startDate.getTime() ||
            day.date.getTime() > finishDate.getTime(),
        );

        for (const day of daysToRemove) {
          const placePromises = day.places.map((place) =>
            this.tripsDayService.movePlaceToUnassignedPlaces(
              day.id,
              {
                placeId: place.id,
                unassignedPlacesId: trip.unassignedPlaces.id,
              },
              transaction,
            ),
          );

          await Promise.all(placePromises);
          await this.tripsDayService.remove(day.id, transaction);
        }

        const newDates: Date[] = [];
        let currentDate = new Date(startDate);
        while (currentDate.getTime() <= finishDate.getTime()) {
          const exists = existingTripDays.some(
            (day) => day.date.getTime() === currentDate.getTime(),
          );

          if (!exists) {
            newDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const newDayPromises = newDates.map((date) =>
          this.tripsDayService.create({ date, tripId: trip.id }, transaction),
        );
        await Promise.all(newDayPromises);
      }

      await trip.update(
        { ...tripData, startDate, finishDate },
        { transaction },
      );

      if (!!file) {
        await this.imagesService.create({
          entityType: EntityType.TRIP,
          entityId: trip.id,
          file,
        });
      }
      await transaction.commit();
      return trip;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }

  async remove(id: number) {
    ensureId(id);

    await this.tripModel.destroy({ where: { id } });

    await Promise.all([
      this.unassignedPlacesService.findByTripIdAndRemove(id),
      this.tripsDayService.removeAllByTripId(id),
    ]);

    return { message: 'Trip and related entities successfully deleted' };
  }
}
