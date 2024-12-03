export interface ICreateTrip {
  userId: number
  title: string
  startDate: Date
  finishDate: Date
  comment?: string
}

export type IUpdateTrip = Partial<ICreateTrip>
