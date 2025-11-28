import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDomain } from './user.domain';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userDomain: jest.Mocked<UserDomain>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserDomain,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userDomain = module.get(UserDomain);
  });

  describe('create', () => {
    it('Создание пользователя: обработка существования пользователя с такими учетными данными', async () => {
      userDomain.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@mail.ru',
      } as any);

      await expect(
        service.create({
          email: 'test@mail.ru',
          password: '123456',
          firstName: 'Иван',
          lastName: 'Иванов',
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('Создание пользователя: пользователь создается, если E-mail уникальный', async () => {
      userDomain.findByEmail.mockResolvedValue(null);
      userDomain.create.mockResolvedValue({
        id: 1,
        email: 'unique@mail.ru',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: null,
        hashedPassword: 'hashedPassword',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any);

      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');

      const result = await service.create({
        email: 'unique@mail.ru',
        password: '123456',
        firstName: 'Иван',
        lastName: 'Иванов',
      } as any);

      expect(result.email).toBe('unique@mail.ru');
      expect(userDomain.create).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('Получение пользователя по ID: обработка ошибки, если такого пользователя не существует', async () => {
      userDomain.findOne.mockResolvedValue(null);
      await expect(service.getOne(1)).rejects.toThrow(NotFoundException);
    });

    it('Получение пользователя по ID: возврат записи, если найден пользователь', async () => {
      const user = {
        id: 1,
        email: 'test@mail.ru',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: null,
        createdAt: '',
        updatedAt: '',
      };
      userDomain.findOne.mockResolvedValue(user as any);
      const result = await service.getOne(1);
      expect(result.id).toBe(user.id);
    });
  });

  describe('update', () => {
    it('Обновление пользователя: пользователь должен существовать', async () => {
      const user = {
        id: 1,
        email: 'test@mail.ru',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: null,
        createdAt: '',
        updatedAt: '',
      };
      userDomain.findOne.mockResolvedValue(user as any);
      userDomain.update.mockResolvedValue({
        ...user,
        firstName: 'Ваня',
      } as any);

      const result = await service.update(1, { firstName: 'Ваня' } as any);
      expect(result.firstName).toBe('Ваня');
    });
  });

  describe('changePassword', () => {
    it('Смена пароля пользователя: пароль изменен успешно', async () => {
      userDomain.findOne.mockResolvedValue({ id: 1 } as any);
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');

      const result = await service.changePassword(1, 'newPassword');
      expect(result.message).toBe('Пароль успешно изменен');
      expect(userDomain.updatePassword).toHaveBeenCalledWith(
        1,
        'hashedPassword',
      );
    });
  });

  describe('validateUser', () => {
    let service: UserService;
    let userDomain: jest.Mocked<UserDomain>;

    beforeEach(() => {
      userDomain = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        updatePassword: jest.fn(),
      } as any;

      service = new UserService(userDomain);
    });

    it('Валидация пользователя: обработка ошибки, если пользователя с таким E-mail не существует', async () => {
      userDomain.findByEmail.mockResolvedValue(null);
      await expect(
        service.validateUser('wrong@mail.ru', 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Валидация пользователя: обработка ошибки, если пароль неверный', async () => {
      const user = {
        id: 1,
        email: 'test@mail.ru',
        hashedPassword: 'hashed',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: null,
        createdAt: '',
        updatedAt: '',
      };
      userDomain.findByEmail.mockResolvedValue(user as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@mail.ru', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Валидация пользователя: возврат данных по пользователю, если все корректно', async () => {
      const user = {
        id: 1,
        email: 'test@mail.ru',
        hashedPassword: 'hashed',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: null,
        createdAt: '',
        updatedAt: '',
      };
      userDomain.findByEmail.mockResolvedValue(user as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@mail.ru', 'correct');
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
    });
  });
});
