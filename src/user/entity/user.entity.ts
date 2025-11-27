import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user', comment: 'Пользователь' })
export class User {
  @PrimaryGeneratedColumn({ comment: 'Идентификатор записи пользователя' })
  id: number;

  @Column({ name: 'first_name', comment: 'Имя пользователя' })
  firstName: string;

  @Column({ name: 'last_name', comment: 'Фамилия пользователя' })
  lastName: string;

  @Column({
    name: 'middle_name',
    comment: 'Отчество пользователя',
    nullable: true,
  })
  middleName: string | null;

  @Column({
    name: 'hashed_password',
    comment: 'Хэшированный пароль пользователя',
  })
  hashedPassword: string;

  @Column({ comment: 'E-mail пользователя', unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at', comment: 'Дата создания записи' })
  createdAt: string;

  @CreateDateColumn({
    name: 'updated_at',
    comment: 'Дата последнего обновления записи',
  })
  updatedAt: string;
}
