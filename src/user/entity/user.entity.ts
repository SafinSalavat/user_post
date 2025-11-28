import { Post } from 'src/post/entity/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user', comment: 'Пользователь' })
export class User {
  @PrimaryGeneratedColumn({ comment: 'Идентификатор записи пользователя' })
  id: number;

  @Column({ name: 'first_name', comment: 'Имя пользователя', type: 'varchar' })
  firstName: string;

  @Column({
    name: 'last_name',
    comment: 'Фамилия пользователя',
    type: 'varchar',
  })
  lastName: string;

  @Column({
    name: 'middle_name',
    comment: 'Отчество пользователя',
    type: 'varchar',
    nullable: true,
  })
  middleName: string | null;

  @Column({
    name: 'hashed_password',
    comment: 'Хэшированный пароль пользователя',
    type: 'varchar',
  })
  hashedPassword: string;

  @Column({ comment: 'E-mail пользователя', unique: true, type: 'varchar' })
  email: string;

  @CreateDateColumn({ name: 'created_at', comment: 'Дата создания записи' })
  createdAt: string;

  @CreateDateColumn({
    name: 'updated_at',
    comment: 'Дата последнего обновления записи',
  })
  updatedAt: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
