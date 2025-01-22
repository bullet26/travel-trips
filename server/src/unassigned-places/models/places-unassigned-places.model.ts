import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { UnassignedPlaces } from './unassigned-places.model';

@Table({
  tableName: 'places_unassignedPlaces',
  createdAt: false,
  updatedAt: false,
})
export class Places_UnassignedPlaces extends Model<Places_UnassignedPlaces> {
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

  @ForeignKey(() => UnassignedPlaces)
  @Column({ type: DataType.INTEGER })
  unassignedPlacesId: number;
}
