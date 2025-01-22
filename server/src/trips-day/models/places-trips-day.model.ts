import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { TripDay } from './trips-day.model';

@Table({
  tableName: 'places_tripsDays',
  createdAt: false,
  updatedAt: false,
})
export class Places_TripDays extends Model<Places_TripDays> {
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

  @ForeignKey(() => TripDay)
  @Column({ type: DataType.INTEGER })
  tripDayId: number;
}
