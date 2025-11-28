import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
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
}

export class RefreshRequestDto {
  @ApiProperty({
    description: 'Refresh токен',
    example: 'giueawrggh9aerhgeaohgeohrioewnoi32',
  })
  @IsNotEmpty({ message: 'Поле refreshToken обязательно для заполнения' })
  refreshToken: string;
}
