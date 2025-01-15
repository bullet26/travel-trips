import { PlaceNest } from 'types'

export interface IAddPlace {
  placeId: number
}

export interface ICreateTripsDay {
  tripId: number
  date: Date
}

export type IUpdateTripsDay = Partial<ICreateTripsDay>

export interface IMovePlaceToUnassignedPlaces {
  placeId: number
  unassignedPlacesId: number
}

export interface IMovePlaceToTripDay {
  placeId: number
  tripDayId: number
}

export interface TripDayNest extends ICreateTripsDay {
  createdAt: Date
  date: Date
  id: number
  places: Pick<PlaceNest, 'id' | 'name' | 'images'>[]
  updatedAt: Date
}
