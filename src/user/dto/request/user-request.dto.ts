import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class UserCreateRequestDto {
  @ApiProperty({
    description: 'E-mail пользователя',
    example: 'example@mail.ru',
  })
  @IsEmail({}, { message: 'Поле email содержит некорректный формат' })
  @IsNotEmpty({ message: 'Поле email обязательно для заполнения' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя. Минимум 6 символов.',
    example: 'qwerty123',
  })
  @IsNotEmpty({ message: 'Поле password обязательно для заполнения' })
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsNotEmpty({ message: 'Поле firstName обязательно для заполнения' })
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  @IsNotEmpty({ message: 'Поле lastName обязательно для заполнения' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Отчество пользователя',
    example: 'Иванович',
    nullable: true,
  })
  @IsOptional()
  middleName?: string | null;
}

export class UserUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'E-mail пользователя',
    example: 'example@mail.ru',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Поле email содержит некорректный формат' })
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле firstName не может быть пустым' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле lastName не может быть пустым' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Отчество пользователя',
    example: 'Иванович',
    nullable: true,
  })
  @IsOptional()
  middleName?: string | null;
}

export class ChangeUserPasswordRequestDto {
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'qwerty123',
  })
  @IsNotEmpty({ message: 'Поле password обязательно для заполнения' })
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  password: string;
}
