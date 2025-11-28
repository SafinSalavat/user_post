import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

export class GetOneUserResponse {
  @ApiProperty({ description: 'Идентификатор записи пользователя', example: 1 })
  id: number;

  @ApiProperty({
    description: 'E-mail пользователя',
    example: 'example@mail.ru',
  })
  email: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов' })
  lastName: string;

  @ApiProperty({
    description: 'Отчество пользователя',
    example: 'Иванович',
    nullable: true,
  })
  middleName: string | null;

  @ApiProperty({
    description: 'Дата создания записи',
    example: '2014-04-04 20:32:59.390583+02',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата последнего обновления записи',
    example: '2014-04-04 20:32:59.390583+02',
  })
  updatedAt: string;

  static map(entity: User): GetOneUserResponse {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      middleName: entity.middleName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export class BasicMessageResponse {
  @ApiProperty({
    description: 'Стандартное сообщение об успешной операции',
    example: 'Запись успешно обновлена',
  })
  message: string;
}
