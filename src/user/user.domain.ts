import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  UserCreateRequestDto,
  UserUpdateRequestDto,
} from './dto/request/user-request.dto';

@Injectable()
export class UserDomain {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder()
      .select()
      .where({ id })
      .getOne();
  }

  async findOneOrFall(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .select()
      .where({ id })
      .getOneOrFail();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder()
      .select()
      .where({ email })
      .getOne();
  }

  async create(
    dto: UserCreateRequestDto,
    hashedPassword: string,
  ): Promise<User> {
    const newUserInsertResult = await this.userRepository
      .createQueryBuilder()
      .insert()
      .values({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        hashedPassword,
      })
      .returning('*')
      .execute();

    return newUserInsertResult.generatedMaps[0] as User;
  }

  async update(id: number, dto: UserUpdateRequestDto): Promise<User> {
    const updateValues: Partial<User> = {};

    if (dto.email) updateValues.email = dto.email;
    if (dto.firstName) updateValues.firstName = dto.firstName;
    if (dto.lastName) updateValues.lastName = dto.lastName;
    if (dto.middleName !== undefined) updateValues.middleName = dto.middleName;

    await this.userRepository
      .createQueryBuilder()
      .update()
      .set(updateValues)
      .where({ id })
      .execute();

    return this.findOneOrFall(id);
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ hashedPassword })
      .where({ id })
      .execute();
  }
}
