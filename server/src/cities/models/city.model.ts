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
import { EntityType } from 'src/images';
import { Images } from 'src/images/models/image.model';
import { Place } from 'src/places/models/place.model';

interface CityCreationAttrs {
  countryId: number;
  name: string;
  latitude: number;
  longitude: number;
}

@Table({ tableName: 'city' })
export class City extends Model<City, CityCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  longitude: number;

  @HasMany(() => Place)
  places: Place[];

  // @HasMany(() => Images, {
  //   foreignKey: 'entityId',
  //   constraints: false, // убираем ограничения для полиморфной связи
  //   scope: { entityType: EntityType.CITY }, // устанавливаем тип сущности
  // })
  // images: Images[];
}
