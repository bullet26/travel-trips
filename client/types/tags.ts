export interface ICreateTag {
  name: string
}

export type IUpdateTag = Partial<ICreateTag>

export interface TagNest extends ICreateTag {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface TagAttributesNest {
  name: string
  id: number
}
