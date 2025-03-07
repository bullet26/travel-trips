import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import {
  CreateWishlistDto,
  UpdateWishlistDto,
  TransformWLToTripDto,
} from './dto';
import { AddPlaceDto } from 'src/trips-day/dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get('/user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.wishlistsService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wishlistsService.findById(Number(id));
  }

  @Patch('/place/add/:id')
  addPlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.wishlistsService.addPlace(Number(id), addPlaceDto);
  }

  @Patch('/place/remove/:id')
  removePlace(@Param('id') id: string, @Body() addPlaceDto: AddPlaceDto) {
    return this.wishlistsService.unlinkPlace(Number(id), addPlaceDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(Number(id), updateWishlistDto);
  }

  @Put('/transform-to-trip/:id')
  transformWishlistToTrip(
    @Param('id') id: string,
    @Body() transformWLToTripDto: TransformWLToTripDto,
  ) {
    return this.wishlistsService.transformWishlistToTrip(
      Number(id),
      transformWLToTripDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistsService.remove(Number(id));
  }
}
