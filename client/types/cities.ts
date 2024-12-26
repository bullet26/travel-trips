import { ImageAttributesNest } from 'types'

export interface ICreateCity {
  countryId: number
  name: string
  latitude: number
  longitude: number
  file?: string | Blob
}

export type IUpdateCity = Partial<ICreateCity>

export interface CityNest extends ICreateCity {
  id: number
  createdAt: Date
  updatedAt: Date
  images: ImageAttributesNest[]
  country?: { id: number; name: string }
  places?: {
    id: number
    name: string
    images?: ImageAttributesNest[]
  }[]
}
