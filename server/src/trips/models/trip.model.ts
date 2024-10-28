import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { User } from 'src/users/models/users.model';

interface TripCreationAttrs {
  title: string;
  startDate: string;
  finishDate: string;
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
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  startDate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  finishDate: string;

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
}
