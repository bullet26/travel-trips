import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUnassignedPlaceDto } from './dto';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place, PlacesService } from 'src/places';
import { AddPlaceDto, MovePlaceToTripDayDto } from 'src/trips-day/dto';
import { TripsDayService } from 'src/trips-day/trips-day.service';

@Injectable()
export class UnassignedPlacesService {
  constructor(
    @InjectModel(UnassignedPlaces)
    private unassignedPlacesModel: typeof UnassignedPlaces,
    private placesService: PlacesService,
    @Inject(forwardRef(() => TripsDayService))
    private tripsDayService: TripsDayService,
  ) {}

  async create(createUnassignedPlaceDto: CreateUnassignedPlaceDto) {
    const unassignedPlaces = await this.unassignedPlacesModel.create(
      createUnassignedPlaceDto,
    );
    return unassignedPlaces;
  }

  async findById(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id, {
      include: {
        model: Place,
        attributes: ['id', 'name', 'description'],
      },
    });
    return unassignedPlaces;
  }

  async findByTripId(tripId: number) {
    const unassignedPlace = await this.unassignedPlacesModel.findOne({
      where: { tripId },
    });
    return unassignedPlace;
  }

  async addPlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id);
    const place = await this.placesService.findById(placeId);

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

    await unassignedPlaces.$add('places', place.id);
    return unassignedPlaces;
  }

  async removePlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id);
    const place = await this.placesService.findById(placeId);

    if (!unassignedPlaces) {
      throw new NotFoundException(`Unassigned_Places not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

    await unassignedPlaces.$remove('places', place.id);
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

    const unassignedPlaces = await this.unassignedPlacesModel.findByPk(id);
    const place = await this.placesService.findById(placeId);
    const tripDay = await this.tripsDayService.findById(tripDayId);

    if (!unassignedPlaces) {
      throw new NotFoundException(`Unassigned_Places not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }
    if (!tripDay) {
      throw new NotFoundException(`Trip day not found by ${tripDay}`);
    }

    await unassignedPlaces.$remove('places', place.id);
    await this.tripsDayService.addPlace(tripDayId, { placeId });

    return tripDay;
  }

  async findByTripIdAndRemove(tripId: number) {
    if (!tripId) {
      throw new BadRequestException('id wasn`t set');
    }

    await this.unassignedPlacesModel.destroy({
      where: { tripId },
    });
  }
}
