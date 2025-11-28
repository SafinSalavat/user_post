import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/config.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { validateUser: jest.fn(), create: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
        {
          provide: AppConfigService,
          useValue: {
            jwtConfig: {
              JWT_ACCESS_SECRET: 'access',
              JWT_REFRESH_SECRET: 'refresh',
            },
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    configService = module.get(AppConfigService);
  });

  describe('login', () => {
    it('Авторизация: возврат токенов при успехе', async () => {
      userService.validateUser.mockResolvedValue({
        id: 1,
        email: 'test@mail.ru',
      } as any);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login({
        email: 'test@mail.ru',
        password: '123456',
      } as any);
      expect(result.data.accessToken).toBe('token');
      expect(result.data.refreshToken).toBe('token');
    });
  });

  describe('register', () => {
    it('Регистрация: возврат токенов при успешной регистрации', async () => {
      userService.create.mockResolvedValue({
        id: 1,
        email: 'test@mail.ru',
      } as any);
      jwtService.sign.mockReturnValue('token');

      const result = await service.register({
        email: 'test@mail.ru',
        password: '123456',
        firstName: 'Иван',
        lastName: 'Иванов',
      } as any);
      expect(result.data.accessToken).toBe('token');
      expect(result.data.refreshToken).toBe('token');
    });
  });

  describe('refresh', () => {
    it('Обновление токенов: обработка ошибки при неверном токене', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      await expect(service.refresh('badtoken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Обновление токенов: возврат токенов, если все в порядке', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, email: 'test@mail.ru' });
      jwtService.sign.mockReturnValue('token');

      const result = await service.refresh('validtoken');
      expect(result.data.accessToken).toBe('token');
    });
  });
});
