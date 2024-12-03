export interface ICreateUser {
  name: string
  provider?: string
  providerId?: string | null
  email: string
  password: string
}

export type IUpdateUser = Partial<ICreateUser>

export interface IAddRole {
  userId: number
  role: string
}

export interface ILoginUser {
  email: string
  password: string
}
