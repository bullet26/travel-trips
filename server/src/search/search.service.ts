import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { SearchAllDto } from './dto';
import { Place } from 'src/places';

@Injectable()
export class SearchService {
  constructor(private readonly sequelize: Sequelize) {}

  async searchEverywhere({ searchString, limit = 10 }: SearchAllDto) {
    const searchQuery = searchString
      .trim()
      .split(/\s+/)
      .map((word) => `${word}:*`) // `:*` для поиска с префиксом
      .join(' & '); // (логическое "и")

    const sql = `
        SELECT id, name, 'country' AS type FROM public.country
        WHERE tsvector_field @@ to_tsquery('simple', :searchQuery)
        UNION ALL
        SELECT id, name, 'city' AS type FROM public.city
        WHERE tsvector_field @@ to_tsquery('simple', :searchQuery)
        UNION ALL
        SELECT id, name, 'place' AS type FROM public.place
        WHERE tsvector_field @@ to_tsquery('simple', :searchQuery)
        ORDER BY name
        LIMIT :limit;
`;

    const results = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {
        searchQuery,
        limit,
      },
    });

    return results;
  }

  async searchPlaces({ searchString, limit = 10 }: SearchAllDto) {
    const searchQuery = searchString
      .trim()
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(' & ');

    const results = await Place.findAll({
      where: Sequelize.literal(
        `tsvector_field @@ to_tsquery('simple', '${searchQuery}')`,
      ),

      attributes: ['name', 'id'],
      order: [['name', 'ASC']],
      limit,
    });

    return results;
  }
}
