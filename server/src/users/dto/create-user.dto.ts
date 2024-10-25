import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly password: string;
}
