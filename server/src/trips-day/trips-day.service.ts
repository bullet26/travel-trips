import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
} from './dto';
import { UnassignedPlacesService } from 'src/unassigned-places/unassigned-places.service';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class TripsDayService {
  constructor(
    @InjectModel(TripDay) private tripDayModel: typeof TripDay,
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
        attributes: ['name', 'description'],
      },
    });

    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    return tripDay;
  }

  async findAllByTrip(tripId: number) {
    ensureId(tripId);

    const tripDays = await this.tripDayModel.findAll({
      where: { tripId },
      include: {
        model: Place,
        attributes: ['name', 'description'],
      },
    });
    return tripDays;
  }

  async update(id: number, updateTripsDayDto: UpdateTripsDayDto) {
    ensureId(id);

    const tripDay = await this.tripDayModel.findByPk(id);

    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    await tripDay.update(updateTripsDayDto);
    return tripDay;
  }

  async remove(id: number) {
    ensureId(id);

    const tripDay = await this.tripDayModel.findByPk(id);

    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    await tripDay.destroy();
    return { message: 'Trip_Day was successfully deleted' };
  }

  async removeAllByTripId(tripId: number) {
    ensureId(tripId);

    await this.tripDayModel.destroy({
      where: { tripId },
    });
  }

  async addPlace(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    ensureId(id);
    ensureId(placeId);

    const tripDay = await this.tripDayModel.findByPk(id, { transaction });
    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    const place = await this.placesService.findById(placeId, transaction);
    ensureEntityExists({ entity: place, entityName: 'Place', value: placeId });

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

  async removePlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    ensureId(id);
    ensureId(placeId);

    const tripDay = await this.tripDayModel.findByPk(id);
    ensureEntityExists({ entity: tripDay, entityName: 'Trip_Day', value: id });

    const place = await this.placesService.findById(placeId);
    ensureEntityExists({ entity: place, entityName: 'Place', value: placeId });

    await tripDay.$remove('places', place.id);
    return tripDay;
  }

  async movePlaceToUnassignedPlaces(
    id: number,
    movePlaceToUnassignedPlacesDto: MovePlaceToUnassignedPlacesDto,
  ) {
    const { placeId, unassignedPlacesId } = movePlaceToUnassignedPlacesDto;

    ensureId(id);
    ensureId(placeId);
    ensureId(unassignedPlacesId);

    const transaction: Transaction =
      await this.tripDayModel.sequelize.transaction();

    try {
      const tripDay = await this.tripDayModel.findByPk(id, { transaction });
      ensureEntityExists({
        entity: tripDay,
        entityName: 'Trip_Day',
        value: id,
      });

      const place = await this.placesService.findById(placeId, transaction);
      ensureEntityExists({
        entity: place,
        entityName: 'Place',
        value: placeId,
      });

      const unassignedPlaces = await this.unassignedPlacesService.findById(
        unassignedPlacesId,
        transaction,
      );
      ensureEntityExists({
        entity: unassignedPlaces,
        entityName: 'Unassigned_Places',
        value: unassignedPlacesId,
      });

      await tripDay.$remove('places', place.id, { transaction });
      await this.unassignedPlacesService.addPlace(
        unassignedPlacesId,
        {
          placeId,
        },
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
}
