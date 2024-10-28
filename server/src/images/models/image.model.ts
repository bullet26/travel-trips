import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityType } from '../types/EntityType';
import { Trip } from 'src/trips/models/trip.model';

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
}
