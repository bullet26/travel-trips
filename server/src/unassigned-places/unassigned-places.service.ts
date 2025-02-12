import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUnassignedPlaceDto } from './dto';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place, PlacesService } from 'src/places';
import { AddPlaceDto, MovePlaceToTripDayDto } from 'src/trips-day/dto';
import { TripsDayService } from 'src/trips-day/trips-day.service';
import { Transaction } from 'sequelize';
import { ensureEntityExists, ensureId } from 'src/utils';
import { EntityType, Images } from 'src/images';
import { Trip } from 'src/trips';
import { TripDay } from 'src/trips-day';
import { Places_UnassignedPlaces } from './models/places-unassigned-places.model';

@Injectable()
export class UnassignedPlacesService {
  constructor(
    @InjectModel(UnassignedPlaces)
    private unassignedPlacesModel: typeof UnassignedPlaces,
    @InjectModel(Places_UnassignedPlaces)
    private placesUnassignedPlacesModel: typeof Places_UnassignedPlaces,
    private placesService: PlacesService,
    @Inject(forwardRef(() => TripsDayService))
    private tripsDayService: TripsDayService,
  ) {}

  async create(
    createUnassignedPlaceDto: CreateUnassignedPlaceDto,
    transaction?: Transaction,
  ) {
    const unassignedPlaces = await this.unassignedPlacesModel.create(
      createUnassignedPlaceDto,
      { transaction },
    );
    return unassignedPlaces;
  }

  async findById(id: number, transaction?: Transaction) {
    ensureId(id);

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
      transaction,
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['id', 'name', 'latitude', 'longitude'],
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

    ensureEntityExists({
      entity: unassignedPlaces,
      entityName: 'Unassigned_Places',
      value: id,
    });

    return unassignedPlaces;
  }

  async findByIdWithTripInfo(id: number, transaction?: Transaction) {
    ensureId(id);

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
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
              model: TripDay,
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

    ensureEntityExists({
      entity: unassignedPlaces,
      entityName: 'Unassigned_Places',
      value: id,
    });

    return unassignedPlaces;
  }

  async findByTripId(tripId: number, transaction?: Transaction) {
    const unassignedPlace = await this.unassignedPlacesModel.findOne({
      where: { tripId },
      transaction,
    });
    return unassignedPlace;
  }

  async addPlace(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    const unassignedPlaces = await this.findByIdWithTripInfo(id, transaction);

    const place = await this.placesService.findById(placeId, transaction);

    const tripDays = unassignedPlaces.trip.tripDays;
    const isPlaceAlreadyAddedToTrip = tripDays.some((item) =>
      item.places.some((place) => place.id === placeId),
    );

    if (isPlaceAlreadyAddedToTrip) {
      throw new BadRequestException(
        'This place already added to this trip (trip day)',
      );
    }

    await unassignedPlaces.$add('places', place.id, { transaction });
    return unassignedPlaces;
  }

  async unlinkPlace(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    const unassignedPlaces = await this.findById(id, transaction);

    const place = await this.placesService.findById(placeId, transaction);

    await unassignedPlaces.$remove('places', place.id, { transaction });
    return unassignedPlaces;
  }

  async unlinkAllPlaces(unassignedPlacesId: number, transaction?: Transaction) {
    await this.placesUnassignedPlacesModel.destroy({
      where: { unassignedPlacesId },
      transaction,
    });
  }

  async movePlaceToTripDay(
    id: number,
    movePlaceToTripDayDto: MovePlaceToTripDayDto,
  ) {
    const { placeId, tripDayId } = movePlaceToTripDayDto;

    const transaction: Transaction =
      await this.unassignedPlacesModel.sequelize.transaction();

    try {
      const unassignedPlaces = await this.findById(id, transaction);

      const place = await this.placesService.findById(placeId, transaction);

      const tripDay = await this.tripsDayService.findById(
        tripDayId,
        transaction,
      );

      await unassignedPlaces.$remove('places', place.id, { transaction });
      await this.tripsDayService.addPlaceFromUnassignedPlaces(
        tripDayId,
        { placeId },
        transaction,
      );

      await transaction.commit();
      return tripDay;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }

  async findByTripIdAndRemove(tripId: number, transaction?: Transaction) {
    ensureId(tripId);

    const unassignedPlaces = await this.findByTripId(tripId);

    await this.unlinkAllPlaces(unassignedPlaces.id, transaction);

    await this.unassignedPlacesModel.destroy({
      where: { tripId },
      transaction,
    });
  }
}
