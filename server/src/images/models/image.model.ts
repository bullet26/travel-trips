import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityType } from '../types/EntityType';
import { Trip } from 'src/trips/models/trip.model';
import { Place } from 'src/places/models/place.model';
import { City } from 'src/cities/models/city.model';

interface ImageCreationAttrs {
  url: string;
  entityType: EntityType;
  entityId: number;
}

@Table({ tableName: 'images' })
export class Images extends Model<Images, ImageCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  url: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(EntityType),
    allowNull: false,
  })
  entityType: EntityType;

  @Column({ type: DataType.INTEGER, allowNull: false })
  entityId: number;

  @BelongsTo(() => Trip, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
  })
  trip: Trip;

  @BelongsTo(() => Place, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
  })
  place: Place;

  @BelongsTo(() => City, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
  })
  city: City;
}
