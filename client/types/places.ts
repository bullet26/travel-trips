import { ImageAttributesNest, TagAttributesNest } from 'types'

export interface IAddTag {
  tagId: number
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface ICreatePlace {
  name: string
  description: string
  latitude: number
  longitude: number
  address: string
  cityId: number
  file?: string | Blob
  tagIds?: number[]
  translations: string[]
}

export type IUpdatePlace = Partial<ICreatePlace>

export interface PlaceNest extends ICreatePlace {
  id: number
  createdAt: Date
  updatedAt: Date
  images: ImageAttributesNest[]
  tags: TagAttributesNest[]
  tripDayId: number | null
  unassignedPlacesId: number | null
  wishlistId: number | null
  city?: { id: number; name: string }
}
