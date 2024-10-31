import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Place } from 'src/places/models/place.model';
import { Tag } from './models/tag.model';
import { PlacesTags } from './models/places-tags.model';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [SequelizeModule.forFeature([Place, Tag, PlacesTags])],
  exports: [TagsService],
})
export class TagsModule {}
