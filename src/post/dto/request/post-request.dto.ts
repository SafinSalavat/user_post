import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsISO8601,
} from 'class-validator';

export class PostCreateRequestDto {
  @ApiProperty({
    description: 'Название статьи',
    example: 'Самое тестовое название статьи',
  })
  @IsNotEmpty({ message: 'Поле title обязательно для заполнения' })
  @IsString({ message: 'Поле title должно быть строкой' })
  title: string;

  @ApiProperty({
    description: 'Описание статьи',
    example: 'Я бы описал тестовое описание, но не описал',
  })
  @IsNotEmpty({ message: 'Поле description обязательно для заполнения' })
  @IsString({ message: 'Поле description должно быть строкой' })
  description: string;
}

export class PostQueryFilterRequestDto {
  @ApiPropertyOptional({
    description: 'Номер страницы пагинации',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле page должно быть целым числом' })
  @Min(1, { message: 'Поле page должно быть больше или равно 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле limit должно быть целым числом' })
  @Min(1, { message: 'Поле limit должно быть больше или равно 1' })
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Фильтр по названию статьи',
    example: 'Как устроен NestJS',
  })
  @IsOptional()
  @IsString({ message: 'Поле title должно быть строкой' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по дате публикации статьи',
    example: '2025-01-15',
  })
  @IsOptional()
  @IsISO8601(
    {},
    { message: 'Поле publishedAt должно быть датой в формате ISO8601' },
  )
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по идентификатору автора',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Поле authorId должно быть целым числом' })
  authorId?: number;
}

export class PostUpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Новое название статьи',
    example: 'Новое название статьи',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле title не может быть пустым' })
  @IsString({ message: 'Поле title должно быть строкой' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Новое описание статьи',
    example: 'Новое подробное описание',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Поле description не может быть пустым' })
  @IsString({ message: 'Поле description должно быть строкой' })
  description?: string;
}
