export interface ICreateCountry {
  name: string
  latitude: number
  longitude: number
}

export type IUpdateCountry = Partial<ICreateCountry>

export interface CountryNest {
  name: string
  id: number
  images: { url: string }[]
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
}
