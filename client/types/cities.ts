export interface ICreateCity {
  countryId: number
  name: string
  latitude: number
  longitude: number
}

export type IUpdateCity = Partial<ICreateCity>

export interface CityNest extends ICreateCity {
  id: number
  createdAt: Date
  updatedAt: Date
  images: string[]
}
