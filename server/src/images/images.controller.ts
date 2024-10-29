import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createImageDto: Omit<CreateImageDto, 'file'>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.create({ ...createImageDto, file });
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.imagesService.findById(Number(id));
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(Number(id));
  }
}
