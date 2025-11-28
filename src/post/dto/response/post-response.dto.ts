import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/post/entity/post.entity';

export class GetOnePostResponse {
  @ApiProperty({
    description: 'Идентификатор статьи',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название статьи',
    example: 'Как устроен NestJS',
  })
  title: string;

  @ApiProperty({
    description: 'Описание статьи',
    example: 'Подробное объяснение модулей',
  })
  description: string;

  @ApiProperty({
    description: 'Идентификатор автора статьи',
    example: 1,
  })
  authorId: number;

  @ApiProperty({
    description: 'Дата публикации статьи',
    example: '2025-01-10T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата последнего обновления записи',
    example: '2025-01-12T14:45:00.000Z',
  })
  updatedAt: string;

  static map(entity: Post): GetOnePostResponse {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      authorId: entity.authorId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Текущая страница', example: 1 })
  page: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Общее количество элементов', example: 100 })
  total: number;

  @ApiProperty({
    description: 'Следующая страница или null',
    example: 2,
    nullable: true,
  })
  nextPage: number | null;

  @ApiProperty({
    description: 'Предыдущая страница или null',
    example: null,
    nullable: true,
  })
  prevPage: number | null;

  @ApiProperty({
    description: 'Массив элементов',
    isArray: true,
    type: Object,
  })
  data: T[];
}
