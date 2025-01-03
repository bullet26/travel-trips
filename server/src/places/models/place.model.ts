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
import { TripDay } from 'src/trips-day/models/trips-day.model';
import { UnassignedPlaces } from 'src/unassigned-places/models/unassigned-places.model';
import { Wishlist } from 'src/wishlists/models/wishlist.model';

interface PlaceCreationAttrs {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  cityId: number;
  translations: string[];
  tsvectorField?: string;
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
  tsvectorField: string;

  @ForeignKey(() => TripDay)
  @Column({ type: DataType.INTEGER })
  tripDayId: number;

  @BelongsTo(() => TripDay)
  tripDay: TripDay;

  @ForeignKey(() => Wishlist)
  @Column({ type: DataType.INTEGER })
  wishlistId: number;

  @BelongsTo(() => Wishlist)
  wishlist: Wishlist;

  @ForeignKey(() => UnassignedPlaces)
  @Column({ type: DataType.INTEGER })
  unassignedPlacesId: number;

  @BelongsTo(() => UnassignedPlaces)
  unassignedPlaces: UnassignedPlaces;

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @HasMany(() => Images, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
    scope: { entityType: EntityType.PLACE }, // устанавливаем тип сущности
  })
  images: Images[];

  @BelongsToMany(() => Tag, () => PlacesTags)
  tags: Tag[];
}
