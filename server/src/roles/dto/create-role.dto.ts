import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  readonly role: string;
}
