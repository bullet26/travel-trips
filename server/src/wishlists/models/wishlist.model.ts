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
import { User } from 'src/users/models/users.model';
import { Places_Wishlists } from './places-wishlist.model';

interface WishlistCreationAttrs {
  title: string;
  comment?: string;
  userId: number;
}

@Table({ tableName: 'wishlist' })
export class Wishlist extends Model<Wishlist, WishlistCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  comment: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => Place, () => Places_Wishlists)
  places: Place[];
}
