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
import { City } from 'src/cities/models/city.model';
import { Images } from 'src/images/models/image.model';
import { EntityType } from 'src/images/types/EntityType';
import { PlacesTags } from 'src/tags/models/places-tags.model';
import { Tag } from 'src/tags/models/tag.model';
import { Places_TripDays } from 'src/trips-day/models/places-trips-day.model';
import { TripDay } from 'src/trips-day/models/trips-day.model';
import { Places_UnassignedPlaces } from 'src/unassigned-places/models/places-unassigned-places.model';
import { UnassignedPlaces } from 'src/unassigned-places/models/unassigned-places.model';
import { Places_Wishlists } from 'src/wishlists/models/places-wishlist.model';
import { Wishlist } from 'src/wishlists/models/wishlist.model';

interface PlaceCreationAttrs {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  cityId: number;
  translations: string[];
  tsvector_field: string;
}

@Table({ tableName: 'place' })
export class Place extends Model<Place, PlaceCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  longitude: number;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  translations: string[];

  @Column({ type: DataType.TSVECTOR, allowNull: false })
  tsvector_field: string;

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @BelongsToMany(() => Tag, () => PlacesTags)
  tags: Tag[];

  @BelongsToMany(() => TripDay, () => Places_TripDays)
  tripDays: TripDay[];

  @BelongsToMany(() => UnassignedPlaces, () => Places_UnassignedPlaces)
  unassignedPlaces: UnassignedPlaces[];

  @BelongsToMany(() => Wishlist, () => Places_Wishlists)
  wishlists: Wishlist[];

  @HasMany(() => Images, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
    scope: { entityType: EntityType.PLACE }, // устанавливаем тип сущности
  })
  images: Images[];
}
