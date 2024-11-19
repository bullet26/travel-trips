import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUnassignedPlaceDto } from './dto';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place, PlacesService } from 'src/places';
import { AddPlaceDto, MovePlaceToTripDayDto } from 'src/trips-day/dto';
import { TripsDayService } from 'src/trips-day/trips-day.service';
import { Transaction } from 'sequelize';

@Injectable()
export class UnassignedPlacesService {
  constructor(
    @InjectModel(UnassignedPlaces)
    private unassignedPlacesModel: typeof UnassignedPlaces,
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
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
      transaction,
      include: {
        model: Place,
        attributes: ['id', 'name', 'description'],
      },
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

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
      transaction,
    });
    const place = await this.placesService.findById(placeId, transaction);

    if (!unassignedPlaces) {
      throw new NotFoundException(`Unassigned_Places not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

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

  async removePlace(
    id: number,
    AddPlaceDto: AddPlaceDto,
    transaction?: Transaction,
  ) {
    const { placeId } = AddPlaceDto;

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
      transaction,
    });
    const place = await this.placesService.findById(placeId, transaction);

    if (!unassignedPlaces) {
      throw new NotFoundException(`Unassigned_Places not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

    await unassignedPlaces.$remove('places', place.id, { transaction });
    return unassignedPlaces;
  }

  async movePlaceToTripDay(
    id: number,
    movePlaceToTripDayDto: MovePlaceToTripDayDto,
  ) {
    const { placeId, tripDayId } = movePlaceToTripDayDto;

    if (!id || !placeId || !tripDayId) {
      throw new BadRequestException('id wasn`t set');
    }

    const transaction: Transaction =
      await this.unassignedPlacesModel.sequelize.transaction();

    try {
      const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
        transaction,
      });
      const place = await this.placesService.findById(placeId, transaction);
      const tripDay = await this.tripsDayService.findById(
        tripDayId,
        transaction,
      );

      if (!unassignedPlaces) {
        throw new NotFoundException(`Unassigned_Places not found by ${id}`);
      }
      if (!place) {
        throw new NotFoundException(`Place not found by ${placeId}`);
      }
      if (!tripDay) {
        throw new NotFoundException(`Trip day not found by ${tripDay}`);
      }

      await unassignedPlaces.$remove('places', place.id, { transaction });
      await this.tripsDayService.addPlace(tripDayId, { placeId }, transaction);

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
    if (!tripId) {
      throw new BadRequestException('id wasn`t set');
    }

    await this.unassignedPlacesModel.destroy({
      where: { tripId },
      transaction,
    });
  }
}
