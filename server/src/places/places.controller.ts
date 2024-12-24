import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto, AddTagDto } from './dto';
import { Roles } from 'src/auth';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.placesService.create({ ...createPlaceDto, file });
  }

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.placesService.findById(Number(id));
  }

  @Get('/city/:cityId')
  findAllByCity(@Param('userId') cityId: string) {
    return this.placesService.findAllByCity(Number(cityId));
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
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.placesService.update(Number(id), { ...updatePlaceDto, file });
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placesService.remove(Number(id));
  }
}
