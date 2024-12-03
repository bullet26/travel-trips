export interface ICreateCity {
  countryId: number
  name: string
  latitude: number
  longitude: number
}

export type IUpdateCity = Partial<ICreateCity>
