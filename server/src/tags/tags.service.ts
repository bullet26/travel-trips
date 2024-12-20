import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from './models/tag.model';
import { Place } from 'src/places';
import { ensureEntityExists, ensureId } from 'src/utils';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  async create(createTagDto: CreateTagDto) {
    const tagInDB = await this.tagModel.findOne({
      where: {
        name: createTagDto.name,
      },
    });

    if (tagInDB) {
      throw new BadRequestException(
        `This tag (${tagInDB.name}) already created`,
      );
    }
    const tag = await this.tagModel.create(createTagDto);
    return tag;
  }

  async findAll() {
    const tags = await this.tagModel.findAll();
    return tags;
  }

  async findById(id: number) {
    ensureId(id);

    const tag = await this.tagModel.findByPk(id, {
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['name', 'description'],
        required: false, // LEFT JOIN вместо INNER JOIN
      },
    });
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: id });

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    ensureId(id);

    const tag = await this.tagModel.findByPk(id);
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: id });

    await tag.update(updateTagDto);
    return tag;
  }

  async remove(id: number) {
    ensureId(id);

    const tag = await this.tagModel.findByPk(id);
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: id });

    await tag.destroy();
    return { message: 'Tag was successfully deleted' };
  }
}
