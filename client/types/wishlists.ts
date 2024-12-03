export interface ICreateWishlist {
  name: string
  comment?: string
}

export type IUpdateWishlist = Partial<ICreateWishlist>

export interface ITransformWLToTrip {
  title: string
  startDate: Date
  finishDate: Date
}
