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
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto } from './dto';
import { Roles } from 'src/auth';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createTripDto: CreateTripDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.tripsService.create({ ...createTripDto, file });
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Get('/user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.tripsService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tripsService.findById(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.tripsService.update(Number(id), { ...updateTripDto, file });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsService.remove(Number(id));
  }
}
