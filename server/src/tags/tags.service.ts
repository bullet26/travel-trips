import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from './models/tag.model';
import { Place } from 'src/places';
import { ensureEntityExists, ensureId } from 'src/utils';
import { EntityType, Images } from 'src/images';

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
    const tags = await this.tagModel.findAll({ order: [['name', 'ASC']] });
    return tags;
  }

  async findGroupByIds(ids: number[]) {
    const tags = await this.tagModel.findAll({ where: { id: ids } });
    return tags;
  }

  async findById(id: number) {
    ensureId(id);

    const tag = await this.tagModel.findByPk(id, {
      include: {
        model: Place,
        through: { attributes: [] }, // Убираем промежуточные атрибуты
        attributes: ['name', 'id'],
        required: false, // LEFT JOIN вместо INNER JOIN
        include: [
          {
            model: Images,
            where: { entityType: EntityType.PLACE },
            attributes: ['url', 'id'],
            required: false, // LEFT JOIN вместо INNER JOIN
          },
        ],
        order: [[{ model: Place, as: 'places' }, 'name', 'ASC']],
      },
    });
    ensureEntityExists({ entity: tag, entityName: 'Tag', value: id });

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findById(id);

    await tag.update(updateTagDto);
    return tag;
  }

  async remove(id: number) {
    ensureId(id);

    await this.tagModel.destroy({ where: { id } });
    return { message: 'Tag was successfully deleted' };
  }
}
