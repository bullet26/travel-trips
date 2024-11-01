import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { TripDay } from 'src/trips-day/models/trips-day.model';
import { UnassignedPlaces } from 'src/unassigned-places/models/unassigned-places.model';
import { User } from 'src/users/models/users.model';

interface TripCreationAttrs {
  name: string;
  startDate: Date;
  finishDate: Date;
  comment?: string;
}

@Table({ tableName: 'trip' })
export class Trip extends Model<Trip, TripCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  finishDate: Date;

  @Column({ type: DataType.STRING })
  comment: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Images, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
    scope: { entityType: EntityType.TRIP }, // устанавливаем тип сущности
  })
  images: Images[];

  @HasMany(() => TripDay)
  tripDays: TripDay[];

  @HasOne(() => UnassignedPlaces)
  unassignedPlaces: UnassignedPlaces;
}
