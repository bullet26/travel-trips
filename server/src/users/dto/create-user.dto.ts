import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(4, 16, {
    message: 'Password length has to be 4 or bigger and 16 or less symbols',
  })
  readonly password: string;
}
