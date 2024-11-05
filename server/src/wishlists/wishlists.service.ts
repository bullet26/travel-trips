import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateWishlistDto,
  TransformWLToTripDto,
  UpdateWishlistDto,
} from './dto';
import { Wishlist } from './models/wishlist.model';
import { PlacesService, Place } from 'src/places';
import { TripsService } from 'src/trips';
import { UnassignedPlacesService } from 'src/unassigned-places';
import { AddPlaceDto } from 'src/trips-day/dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectModel(Wishlist) private wishlistModel: typeof Wishlist,
    private placesService: PlacesService,
    private tripsService: TripsService,
    private unassignedPlacesService: UnassignedPlacesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlist = await this.wishlistModel.create(createWishlistDto);
    return wishlist;
  }

  async findAll() {
    const wishlists = await this.wishlistModel.findAll();
    return wishlists;
  }

  async findAllByUser(userId: number) {
    if (!userId) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlists = await this.wishlistModel.findAll({ where: { userId } });
    return wishlists;
  }

  async findById(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id, {
      include: {
        model: Place,
        attributes: ['name', 'description'],
      },
    });
    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found`);
    }

    await wishlist.update(updateWishlistDto);
    return wishlist;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found`);
    }
    await wishlist.destroy();
  }

  async addPlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id);
    const place = await this.placesService.findById(placeId);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

    await wishlist.$add('places', place.id);
    return wishlist;
  }

  async removePlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    if (!id || !placeId) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id);
    const place = await this.placesService.findById(placeId);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist not found by ${id}`);
    }
    if (!place) {
      throw new NotFoundException(`Place not found by ${placeId}`);
    }

    await wishlist.$remove('places', place.id);
    return wishlist;
  }

  async transformWishlistToTrip(
    id: number,
    transformWLToTripDto: TransformWLToTripDto,
  ) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const wishlist = await this.wishlistModel.findByPk(id);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist not found by ${id}`);
    }

    const trip = await this.tripsService.create({
      ...transformWLToTripDto,
      userId: wishlist.userId,
    });

    const places = await this.placesService.findAllByWishlistId(wishlist.id);

    const unlinkPlacePromises = places.map(
      async (item) => await wishlist.$remove('places', item.id),
    );
    await Promise.all(unlinkPlacePromises);

    let unassignedPlaces = await this.unassignedPlacesService.findByTripId(
      trip.id,
    );
    if (!unassignedPlaces) {
      unassignedPlaces = await this.unassignedPlacesService.create({
        tripId: trip.id,
      });
    }

    const linkPlacePromises = places.map(
      async (item) =>
        await this.unassignedPlacesService.addPlace(unassignedPlaces.id, {
          placeId: item.id,
        }),
    );
    await Promise.all(linkPlacePromises);

    await wishlist.destroy();

    return trip;
  }
}
