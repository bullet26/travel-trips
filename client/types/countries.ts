import { ImageAttributesNest } from 'types'

export interface ICreateCountry {
  name: string
  latitude: number
  longitude: number
  file?: string | Blob
  translations: string[]
}

export type IUpdateCountry = Partial<ICreateCountry>

export interface CountryNest extends ICreateCountry {
  id: number
  images: ImageAttributesNest[]
  createdAt: Date
  updatedAt: Date
  cities: {
    id: number
    name: string
    images?: ImageAttributesNest[]
  }[]
}
