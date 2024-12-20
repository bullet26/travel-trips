import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { EntityType } from 'src/images/types/EntityType';
import { Images } from 'src/images/models/image.model';
import { City } from 'src/cities/models/city.model';

interface CountryCreationAttrs {
  name: string;
  latitude: number;
  longitude: number;
}

@Table({ tableName: 'country' })
export class Country extends Model<Country, CountryCreationAttrs> {
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

  @HasMany(() => City)
  cities: City[];

  @HasMany(() => Images, {
    foreignKey: 'entityId',
    constraints: false, // убираем ограничения для полиморфной связи
    scope: { entityType: EntityType.COUNTRY }, // устанавливаем тип сущности
  })
  images: Images[];
}
