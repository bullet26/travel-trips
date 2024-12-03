export interface IAddTag {
  tagId: number
}

export interface ICreatePlace {
  name: string
  description: string
  latitude: number
  longitude: number
  address: string
}

export type IUpdatePlace = Partial<ICreatePlace>
