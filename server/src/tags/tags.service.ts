import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './models/tag.model';
import { Place } from 'src/places/models/place.model';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  async create(createTagDto: CreateTagDto) {
    const tag = await this.tagModel.create(createTagDto);
    return tag;
  }

  async findAll() {
    const tags = await this.tagModel.findAll();
    return tags;
  }

  async findById(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tag = await this.tagModel.findByPk(id, {
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['name', 'description'],
      },
    });
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tag = await this.tagModel.findByPk(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    await tag.update(updateTagDto);
    return tag;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('id wasn`t set');
    }

    const tag = await this.tagModel.findByPk(id);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    await tag.destroy();
  }
}
