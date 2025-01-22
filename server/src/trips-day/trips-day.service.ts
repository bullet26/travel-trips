import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { TripDay } from './models/trips-day.model';
import { Place, PlacesService } from 'src/places';
import {
  MovePlaceToUnassignedPlacesDto,
  AddPlaceDto,
  CreateTripsDayDto,
  UpdateTripsDayDto,
  MovePlaceToTripDayDto,
} from './dto';
import { UnassignedPlacesService } from 'src/unassigned-places/unassigned-places.service';
import { ensureEntityExists, ensureId } from 'src/utils';
import { EntityType, Images } from 'src/images';
import { Trip } from 'src/trips';
import { UnassignedPlaces } from 'src/unassigned-places';
import { Places_TripDays } from './models/places-trips-day.model';

@Injectable()
export class TripsDayService {
  constructor(
    @InjectModel(TripDay) private tripDayModel: typeof TripDay,
    @InjectModel(Places_TripDays)
    private placesTripDaysModel: typeof Places_TripDays,
    private placesService: PlacesService,
    @Inject(forwardRef(() => UnassignedPlacesService))
    private unassignedPlacesService: UnassignedPlacesService,
  ) {}

  async create(
    createTripsDayDto: CreateTripsDayDto,
    transaction?: Transaction,
  ) {
    const tripDay = await this.tripDayModel.create(createTripsDayDto, {
      transaction,
    });
    return tripDay;
  }

  async findAll() {
    const tripDays = await this.tripDayModel.findAll();
    return tripDays;
  }

  async findById(id: number, transaction?: Transaction) {
    ensureId(id);

    const tripDay = await this.tripDayModel.findByPk(id, {
      transaction,
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['id', 'name'],
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
      order: [[{ model: Place, as: 'places' }, 'name', 'ASC']],
    });

    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    return tripDay;
  }

  async findByIdWithTripInfo(id: number, transaction?: Transaction) {
    ensureId(id);

    const tripDay = await this.tripDayModel.findByPk(id, {
      transaction,
      include: [
        {
          model: Place,
          through: { attributes: [] }, // Убираем промежуточные атрибуты
          attributes: ['id', 'name'],
          required: false, // LEFT JOIN вместо INNER JOIN
        },
        {
          model: Trip,
          attributes: ['id', 'title'],
          required: false, // LEFT JOIN вместо INNER JOIN
          include: [
            {
              model: UnassignedPlaces,
              attributes: ['id'],
              required: false, // LEFT JOIN вместо INNER JOIN
              include: [
                {
                  model: Place,
                  through: { attributes: [] }, // Убираем промежуточные атрибуты
                  attributes: ['id', 'name'],
                  required: false, // LEFT JOIN вместо INNER JOIN
                },
              ],
            },
          ],
        },
      ],
    });

    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    return tripDay;
  }

  async findAllByTrip(tripId: number, transaction?: Transaction) {
    ensureId(tripId);

    const tripDays = await this.tripDayModel.findAll({
      where: { tripId },
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['name', 'id'],
        order: [['name', 'ASC']],
        required: false, // LEFT JOIN вместо INNER JOIN
      },
      transaction,
    });
    return tripDays;
  }

  async update(id: number, updateTripsDayDto: UpdateTripsDayDto) {
    const tripDay = await this.findById(id);

    await tripDay.update(updateTripsDayDto);
    return tripDay;
  }

  async remove(id: number, transaction?: Transaction) {
    ensureId(id);

    await this.unlinkAllPlaces(id, transaction);

    await this.tripDayModel.destroy({ where: { id }, transaction });
    return { message: 'Trip_Day was successfully deleted' };
  }

  async removeAllByTripId(tripId: number, transaction?: Transaction) {
    const tripDays = await this.findAllByTrip(tripId, transaction);
    const tripDayIds = tripDays.map((day) => day.id);

    await this.unlinkAllPlaces(tripDayIds, transaction);

    await this.tripDayModel.destroy({
      where: { tripId },
      transaction,
    });
  }

  async addPlace(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    const tripDay = await this.findByIdWithTripInfo(id);

    const place = await this.placesService.findById(placeId, transaction);

    const unassignedPlaces = tripDay.trip.unassignedPlaces.places;
    const isPlaceAlreadyAddedToTrip = unassignedPlaces.some(
      (item) => item.id === placeId,
    );

    if (isPlaceAlreadyAddedToTrip) {
      throw new BadRequestException(
        'This place already added to this trip (unassigned places)',
      );
    }

    await tripDay.$add('places', place.id, { transaction });
    return tripDay;
  }

  async addPlaceFromUnassignedPlaces(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    const tripDay = await this.findByIdWithTripInfo(id);

    const place = await this.placesService.findById(placeId, transaction);

    await tripDay.$add('places', place.id, { transaction });
    return tripDay;
  }

  async unlinkPlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    const tripDay = await this.findById(id);

    const place = await this.placesService.findById(placeId);

    await tripDay.$remove('places', place.id);
    return tripDay;
  }

  async unlinkAllPlaces(
    tripDayIds: number | number[],
    transaction?: Transaction,
  ) {
    await this.placesTripDaysModel.destroy({
      where: { tripDayId: tripDayIds },
      transaction,
    });
  }

  async movePlaceToAnotherTripDay(
    id: number,
    movePlaceToTripDayDto: MovePlaceToTripDayDto,
  ) {
    const { placeId, tripDayId } = movePlaceToTripDayDto;

    const tripDay = await this.findById(id);
    const targetTripDay = await this.findById(tripDayId);
    const place = await this.placesService.findById(placeId);

    await tripDay.$remove('places', place.id);
    await targetTripDay.$add('places', place.id);
    return targetTripDay;
  }

  async movePlaceToUnassignedPlaces(
    id: number,
    movePlaceToUnassignedPlacesDto: MovePlaceToUnassignedPlacesDto,
    transactionIncome?: Transaction,
  ) {
    const { placeId, unassignedPlacesId } = movePlaceToUnassignedPlacesDto;

    const transaction: Transaction =
      transactionIncome || (await this.tripDayModel.sequelize.transaction());

    try {
      const tripDay = await this.findById(id, transaction);

      const place = await this.placesService.findById(placeId, transaction);

      await this.unassignedPlacesService.findById(
        unassignedPlacesId,
        transaction,
      );

      await tripDay.$remove('places', place.id, { transaction });
      await this.unassignedPlacesService.addPlace(
        unassignedPlacesId,
        {
          placeId,
        },
        transaction,
      );

      // Фиксируем транзакцию, если она локальная
      if (!transactionIncome) {
        await transaction.commit();
      }
      return tripDay;
    } catch (error) {
      if (!transactionIncome) {
        await transaction.rollback();
      }
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }
}
