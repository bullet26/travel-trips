import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { Wishlist } from './wishlist.model';

@Table({
  tableName: 'places_wishlists',
  createdAt: false,
  updatedAt: false,
})
export class Places_Wishlists extends Model<Places_Wishlists> {
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

  @ForeignKey(() => Wishlist)
  @Column({ type: DataType.INTEGER })
  wishlistId: number;
}
