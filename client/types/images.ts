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

export interface ImageNest {
  cloudinaryPublicId: string
  createdAt: Date
  entityId: number
  entityType: EntityType
  id: number
  updatedAt: Date
  url: string
}

export interface ImageAttributesNest {
  url: string
  id: number
}
