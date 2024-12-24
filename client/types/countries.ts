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
  images: { url: string; id: number }[]
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
  cities: {
    id: number
    name: string
  }[]
}
