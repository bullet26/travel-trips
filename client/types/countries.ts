export interface ICreateCountry {
  name: string
  latitude: number
  longitude: number
}

export type IUpdateCountry = Partial<ICreateCountry>
