import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDomain } from './user.domain';
import {
  UserCreateRequestDto,
  UserUpdateRequestDto,
} from './dto/request/user-request.dto';
import * as bcrypt from 'bcrypt';
import {
  BasicMessageResponse,
  GetOneUserResponse,
} from './dto/response/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userDomain: UserDomain) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async checkUserByEmail(email: string): Promise<void> {
    const candidate = await this.userDomain.findByEmail(email);
    if (candidate) {
      throw new ConflictException(
        'Пользователь с такими учетными данными существует',
      );
    }
  }

  async create(dto: UserCreateRequestDto) {
    await this.checkUserByEmail(dto.email);

    const hashedPassword = await this.hashPassword(dto.password);

    const newUser = await this.userDomain.create(dto, hashedPassword);

    return GetOneUserResponse.map(newUser);
  }

  async getOne(id: number): Promise<GetOneUserResponse> {
    const user = await this.userDomain.findOne(id);
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return GetOneUserResponse.map(user);
  }

  async update(id: number, dto: UserUpdateRequestDto) {
    await this.getOne(id);

    if (dto.email) {
      await this.checkUserByEmail(dto.email);
    }

    const updatedUser = await this.userDomain.update(id, dto);
    return GetOneUserResponse.map(updatedUser);
  }

  async changePassword(
    id: number,
    password: string,
  ): Promise<BasicMessageResponse> {
    await this.getOne(id);
    const hashedPassword = await this.hashPassword(password);
    await this.userDomain.updatePassword(id, hashedPassword);
    return {
      message: 'Пароль успешно изменен',
    };
  }
}
