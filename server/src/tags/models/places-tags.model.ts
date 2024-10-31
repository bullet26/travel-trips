import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { Tag } from './tag.model';

@Table({ tableName: 'places_tags', createdAt: false, updatedAt: false })
export class PlacesTags extends Model<PlacesTags> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Place)
  @Column({ type: DataType.INTEGER })
  placeId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER })
  tagId: number;
}
