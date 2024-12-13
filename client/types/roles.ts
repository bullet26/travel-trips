export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface ICreateRole {
  role: RoleType
}
