import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { Transaction } from 'sequelize';
import { ensureEntityExists, ensureId } from 'src/utils';
import { EntityType, Images } from 'src/images';
import { Places_Wishlists } from './models/places-wishlist.model';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectModel(Wishlist) private wishlistModel: typeof Wishlist,
    @InjectModel(Places_Wishlists)
    private placesWishlistsModel: typeof Places_Wishlists,

    private placesService: PlacesService,
    private tripsService: TripsService,
    private unassignedPlacesService: UnassignedPlacesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlist = await this.wishlistModel.create(createWishlistDto);
    return wishlist;
  }

  async findAll() {
    const wishlists = await this.wishlistModel.findAll({
      order: [['title', 'ASC']],
    });
    return wishlists;
  }

  async findAllByUser(userId: number) {
    ensureId(userId);

    const wishlists = await this.wishlistModel.findAll({
      where: { userId },
      order: [['title', 'ASC']],
    });
    return wishlists;
  }

  async findById(id: number, transaction?: Transaction) {
    ensureId(id);

    const wishlist = await this.wishlistModel.findByPk(id, {
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
    });
    ensureEntityExists({ entity: wishlist, entityName: 'Wishlist', value: id });

    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findById(id);

    await wishlist.update(updateWishlistDto);
    return wishlist;
  }

  async remove(id: number) {
    ensureId(id);

    await this.unlinkAllPlaces(id);

    await this.wishlistModel.destroy({ where: { id } });
    return { message: 'Wishlist was successfully deleted' };
  }

  async addPlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    const wishlist = await this.findById(id);

    const place = await this.placesService.findById(placeId);

    await wishlist.$add('places', place.id);
    return wishlist;
  }

  async unlinkPlace(id: number, AddPlaceDto: AddPlaceDto) {
    const { placeId } = AddPlaceDto;

    const wishlist = await this.findById(id);

    const place = await this.placesService.findById(placeId);

    await wishlist.$remove('places', place.id);
    return wishlist;
  }

  async unlinkAllPlaces(wishlistId: number, transaction?: Transaction) {
    await this.placesWishlistsModel.destroy({
      where: { wishlistId },
      transaction,
    });
  }

  async transformWishlistToTrip(
    id: number,
    transformWLToTripDto: TransformWLToTripDto,
  ) {
    ensureId(id);

    const transaction: Transaction =
      await this.wishlistModel.sequelize.transaction();

    try {
      const wishlist = await this.findById(id, transaction);

      const trip = await this.tripsService.create(
        {
          ...transformWLToTripDto,
          userId: wishlist.userId,
        },
        transaction,
      );

      const places = [...wishlist.places];

      await wishlist.$set('places', [], { transaction }); // unlink all places from wishlist

      let unassignedPlaces = await this.unassignedPlacesService.findByTripId(
        trip.id,
        transaction,
      );
      if (!unassignedPlaces) {
        unassignedPlaces = await this.unassignedPlacesService.create(
          {
            tripId: trip.id,
          },
          transaction,
        );
      }

      const linkPlacePromises = places.map(
        async (item) =>
          await this.unassignedPlacesService.addPlace(
            unassignedPlaces.id,
            {
              placeId: item.id,
            },
            transaction,
          ),
      );
      await Promise.all(linkPlacePromises);

      await wishlist.destroy({ transaction });

      await transaction.commit();
      return trip;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }
}
