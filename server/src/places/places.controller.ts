import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AddTagDto } from './dto/add-tag-dto.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto);
  }

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.placesService.findById(Number(id));
  }

  @Patch('/tag/add/:id')
  addTag(@Param('id') id: string, @Body() addTagDto: AddTagDto) {
    return this.placesService.addTag(Number(id), addTagDto);
  }

  @Patch('/tag/remove/:id')
  removeTag(@Param('id') id: string, @Body() addTagDto: AddTagDto) {
    return this.placesService.removeTag(Number(id), addTagDto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(Number(id), updatePlaceDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placesService.remove(Number(id));
  }
}
