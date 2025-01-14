import { RoleType } from './roles'

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

export interface IUser extends ICreateUser {
  role: RoleType
}

export interface NestAuthTokens {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export interface UserNestInfo {
  email: string
  role: RoleType
  name: string
  userId: number
}
