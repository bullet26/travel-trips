export interface IAddTag {
  tagId: number
}

export interface ICreatePlace {
  name: string
  description: string
  latitude: number
  longitude: number
  address: string
  cityId: number
  file?: string | Blob
}

export type IUpdatePlace = Partial<ICreatePlace>

export interface PlaceNest extends ICreatePlace {
  id: number
  createdAt: Date
  updatedAt: Date
  images: { url: string; id: number }[]
  tripDayId: number | null
  unassignedPlacesId: number | null
  wishlistId: number | null
}
