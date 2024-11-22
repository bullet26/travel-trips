import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from 'src/roles/models/roles.model';
import { Trip } from 'src/trips/models/trip.model';
import { Wishlist } from 'src/wishlists/models/wishlist.model';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  provider: string;
  providerId?: string | null;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  provider: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  providerId: string | null;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Trip)
  trips: Trip[];

  @HasMany(() => Wishlist)
  wishlists: Wishlist[];
}
