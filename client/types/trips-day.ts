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
