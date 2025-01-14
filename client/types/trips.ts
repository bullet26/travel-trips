import { ImageAttributesNest } from 'types'

export interface ICreateTrip {
  userId?: number
  title: string
  startDate: Date
  finishDate: Date
  comment?: string | null
}

export type IUpdateTrip = Partial<ICreateTrip>

export interface TripsNest extends Omit<ICreateTrip, 'comment'> {
  id: number
  comment: string | null
  images: ImageAttributesNest[]
  createdAt: Date
  updatedAt: Date
  userId: number
  tripDays: { id: number; date: Date }[]
  unassignedPlaces: { id: number }
}
