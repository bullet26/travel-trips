import { ImageAttributesNest } from 'types'

export interface ICreateCountry {
  name: string
  latitude: number
  longitude: number
  file?: string | Blob
}

export type IUpdateCountry = Partial<ICreateCountry>

export interface CountryNest {
  name: string
  id: number
  images: ImageAttributesNest[]
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
  cities: {
    id: number
    name: string
  }[]
}
