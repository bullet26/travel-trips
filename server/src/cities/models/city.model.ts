import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { EntityType } from 'src/images/types/EntityType';
import { Country } from 'src/countries/models/country.model';
import { Images } from 'src/images/models/image.model';
import { Place } from 'src/places/models/place.model';

interface CityCreationAttrs {
  countryId: number;
  name: string;
  latitude: number;
  longitude: number;
  translations: string[];
  tsvectorField?: string;
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

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  translations: string[];

  @Column({ type: DataType.TSVECTOR, allowNull: false })
  tsvectorField: string;

  @HasMany(() => Place)
  places: Place[];

  @ForeignKey(() => Country)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => Country)
  country: Country;

  @HasMany(() => Images, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
    scope: { entityType: EntityType.CITY }, // устанавливаем тип сущности
  })
  images: Images[];
}
