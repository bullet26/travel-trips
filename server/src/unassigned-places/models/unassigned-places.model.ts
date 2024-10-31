import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { Trip } from 'src/trips/models/trip.model';

interface UnassignedPlacesCreationAttrs {
  tripId: number;
}

@Table({ tableName: 'unassigned-places' })
export class UnassignedPlaces extends Model<
  UnassignedPlaces,
  UnassignedPlacesCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Trip)
  @Column({ type: DataType.INTEGER })
  tripId: number;

  @BelongsTo(() => Trip)
  trip: Trip;

  @HasMany(() => Place)
  places: Place[];
}
