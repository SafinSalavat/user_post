import { IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class UserCreateRequestDto {
  @IsEmail({}, { message: 'Неверное значение E-mail' })
  @IsNotEmpty({})
  email: string;

  @MinLength(6)
  @IsNotEmpty({})
  password: string;

  @IsNotEmpty({})
  firstName: string;

  @IsNotEmpty({})
  lastName: string;

  @IsOptional()
  middleName?: string | null;
}
