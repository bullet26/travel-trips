import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { Trip } from 'src/trips/models/trip.model';
import { Places_TripDays } from './places-trips-day.model';

interface TripDayCreationAttrs {
  tripId: number;
  date: Date;
}

@Table({ tableName: 'trip-day' })
export class TripDay extends Model<TripDay, TripDayCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @ForeignKey(() => Trip)
  @Column({ type: DataType.INTEGER })
  tripId: number;

  @BelongsTo(() => Trip)
  trip: Trip;

  @BelongsToMany(() => Place, () => Places_TripDays)
  places: Place[];
}
