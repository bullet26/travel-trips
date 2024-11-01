import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUnassignedPlaceDto } from './dto/create-unassigned-place.dto';
import { UnassignedPlaces } from './models/unassigned-places.model';
import { Place } from 'src/places/models/place.model';
import { PlacesService } from 'src/places/places.service';
import { AddPlaceDto } from 'src/trips-day/dto/add-place-dto.dto';

@Injectable()
export class UnassignedPlacesService {
  constructor(
    @InjectModel(UnassignedPlaces)
    private unassignedPlacesModel: typeof UnassignedPlaces,
    private placesService: PlacesService,
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

  async findByTripIdAndRemove(tripId: number) {
    if (!tripId) {
      throw new BadRequestException('id wasn`t set');
    }

    await this.unassignedPlacesModel.destroy({
      where: { tripId },
    });
  }
}
