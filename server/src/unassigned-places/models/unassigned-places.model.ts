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
import { Places_UnassignedPlaces } from './places-unassigned-places.model';

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
  @Column({ type: DataType.INTEGER, unique: true })
  tripId: number;

  @BelongsTo(() => Trip)
  trip: Trip;

  @BelongsToMany(() => Place, () => Places_UnassignedPlaces)
  places: Place[];
}
