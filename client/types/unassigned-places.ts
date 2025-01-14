export interface ICreateUnassignedPlace {
  tripId: number
}

export interface UnassignedPlacesNest extends ICreateUnassignedPlace {
  createdAt: Date
  id: number
  places: []
  updatedAt: Date
}
