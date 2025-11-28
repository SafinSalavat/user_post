import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'post', comment: 'Статья' })
export class Post {
  @PrimaryGeneratedColumn({ comment: 'Идентификатор статьи' })
  id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    comment: 'Название статьи',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    comment: 'Описание статьи',
  })
  description: string;

  @Column({
    name: 'author_id',
    type: 'int4',
    comment: 'Идентификатор автора статьи',
  })
  authorId: number;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'Дата создания записи / Дата публикации статьи',
  })
  createdAt: string;

  @CreateDateColumn({
    name: 'updated_at',
    comment: 'Дата последнего обновления записи',
  })
  updatedAt: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;
}
