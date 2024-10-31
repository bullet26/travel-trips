import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './models/wishlist.model';
import { Place } from 'src/places/models/place.model';
import { AddPlaceDto } from 'src/trips-day/dto/add-place-dto.dto';
import { PlacesService } from 'src/places/places.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectModel(Wishlist) private wishlistModel: typeof Wishlist,
    private placesService: PlacesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlist = await this.wishlistModel.create(createWishlistDto);
    return wishlist;
  }

  async findAll() {
    const wishlists = await this.wishlistModel.findAll();
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

  async transformWishlistToTrip(id: number) {}
}
