import { PlaceNest } from 'types'

export interface ICreateWishlist {
  userId?: number
  title: string
  comment?: string | null
}

export type IUpdateWishlist = Partial<ICreateWishlist>

export interface ITransformWLToTrip {
  title: string
  startDate: Date
  finishDate: Date
}

export interface WishlistNest extends ICreateWishlist {
  id: number
  userId: number
  comment: string | null
  places: Pick<PlaceNest, 'id' | 'name' | 'images' | 'latitude' | 'longitude'>[]
  createdAt: Date
  updatedAt: Date
}
