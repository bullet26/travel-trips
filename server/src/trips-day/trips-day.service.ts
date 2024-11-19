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
import sequelize from 'sequelize';

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
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tripDay = await this.tripDayModel.findByPk(id, {
      transaction,
      include: {
        model: Place,
        attributes: ['name', 'description'],
      },
    });

    if (!tripDay) {
      throw new NotFoundException(`TripDay with id ${id} not found`);
    }
    return tripDay;
  }

  async findAllByTrip(tripId: number) {
    if (!tripId) {
      throw new BadRequestException('id wasn`t set');
    }

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
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tripDay = await this.tripDayModel.findByPk(id);

    if (!tripDay) {
      throw new NotFoundException(`Trip day with id ${id} not found`);
    }

    await tripDay.update(updateTripsDayDto);
    return tripDay;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tripDay = await this.tripDayModel.findByPk(id);
    if (!tripDay) {
      throw new NotFoundException(`Trip day with id ${id} not found`);
    }
    await tripDay.destroy();
  }

  async removeAllByTripId(tripId: number) {
    if (!tripId) {
      throw new BadRequestException('id wasn`t set');
    }

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

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const tripDay = await this.tripDayModel.findByPk(id, { transaction });
    const place = await this.placesService.findById(placeId, transaction);

    if (!tripDay) {
      throw new NotFoundException(`Trip day not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

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

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const tripDay = await this.tripDayModel.findByPk(id);
    const place = await this.placesService.findById(placeId);

    if (!tripDay) {
      throw new NotFoundException(`Trip day not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

    await tripDay.$remove('places', place.id);
    return tripDay;
  }

  async movePlaceToUnassignedPlaces(
    id: number,
    movePlaceToUnassignedPlacesDto: MovePlaceToUnassignedPlacesDto,
  ) {
    const { placeId, unassignedPlacesId } = movePlaceToUnassignedPlacesDto;

    if (!id || !placeId || !unassignedPlacesId) {
      throw new BadRequestException('id wasn`t set');
    }

    const transaction: Transaction =
      await this.tripDayModel.sequelize.transaction();

    try {
      const tripDay = await this.tripDayModel.findByPk(id, { transaction });
      const place = await this.placesService.findById(placeId, transaction);
      const unassignedPlaces = await this.unassignedPlacesService.findById(
        unassignedPlacesId,
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
