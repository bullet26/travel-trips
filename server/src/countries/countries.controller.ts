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
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountriesService } from './countries.service';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { Roles } from 'src/auth';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        // TOdo
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.countriesService.create({
      ...createCountryDto,
      file,
    });
  }

  @Get()
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.countriesService.findById(Number(id));
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countriesService.update(Number(id), updateCountryDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(Number(id));
  }
}
