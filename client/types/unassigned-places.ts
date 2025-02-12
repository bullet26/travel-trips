import { PlaceNest } from 'types'

export interface ICreateUnassignedPlace {
  tripId: number
}

export interface UnassignedPlacesNest extends ICreateUnassignedPlace {
  createdAt: Date
  id: number
  places: Pick<PlaceNest, 'id' | 'name' | 'images' | 'latitude' | 'longitude'>[]
  updatedAt: Date
}
