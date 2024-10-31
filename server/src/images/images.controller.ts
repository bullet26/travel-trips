import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { SetImgToEntityDto } from './dto/set-image-to-entity.dto';

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
  @Patch(':id')
  setImgToEntity(
    @Param('id') id: string,
    @Body() setImgToEntityDto: SetImgToEntityDto,
  ) {
    return this.imagesService.setImgToEntity(Number(id), setImgToEntityDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(Number(id));
  }
}
