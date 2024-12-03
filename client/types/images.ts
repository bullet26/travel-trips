export enum EntityType {
  COUNTRY = 'Country',
  CITY = 'City',
  TRIP = 'Trip',
  PLACE = 'Place',
}

export interface ICreateImage {
  file: File
  entityType: EntityType
  entityId: number
}

export interface ISetImgToEntity {
  entityId: number
  entityType: EntityType
}
