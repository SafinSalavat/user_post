import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostDomain } from './post.domain';
import { UserService } from 'src/user/user.service';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let postDomain: jest.Mocked<PostDomain>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostDomain,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: UserService, useValue: { getOne: jest.fn() } },
      ],
    }).compile();

    service = module.get(PostService);
    postDomain = module.get(PostDomain);
    userService = module.get(UserService);
  });

  describe('create', () => {
    it('Создание статьи: необходимо кинуть ошибку, если автора не существует', async () => {
      userService.getOne.mockRejectedValue(new NotFoundException());
      await expect(
        service.create({ title: 'Тест', description: 'Тест' } as any, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('Создание статьи: успешное созздание', async () => {
      userService.getOne.mockResolvedValue({ id: 1 } as any);
      postDomain.create.mockResolvedValue({
        id: 1,
        title: 'Тест',
        description: 'Тест',
        authorId: 1,
        createdAt: '',
        updatedAt: '',
      } as any);

      const result = await service.create(
        { title: 'Тест', description: 'Тест' } as any,
        1,
      );
      expect(result.title).toBe('Тест');
      expect(result.authorId).toBe(1);
    });
  });

  describe('getOne', () => {
    it('Получение информации по статье: обработка ошибки, если статьи не нашлось', async () => {
      postDomain.findOne.mockResolvedValue(null);
      await expect(service.getOne(1)).rejects.toThrow(NotFoundException);
    });

    it('Получение информации по статье: успешный запрос', async () => {
      const post = {
        id: 1,
        title: 'Тест',
        description: 'Тест',
        authorId: 1,
        createdAt: '',
        updatedAt: '',
      };
      postDomain.findOne.mockResolvedValue(post as any);
      const result = await service.getOne(1);
      expect(result.id).toBe(post.id);
    });
  });

  describe('update', () => {
    it('Обновление статьи: успешный запрос', async () => {
      postDomain.findOne.mockResolvedValue({ id: 1 } as any);
      postDomain.update.mockResolvedValue({
        id: 1,
        title: 'Тест2',
        description: 'Тест2',
        authorId: 1,
        createdAt: '',
        updatedAt: '',
      } as any);

      const result = await service.update(1, { title: 'Тест2' } as any);
      expect(result.title).toBe('Тест2');
    });
  });

  describe('delete', () => {
    it('Удаление статьи: успешное удаление', async () => {
      postDomain.findOne.mockResolvedValue({ id: 1 } as any);
      postDomain.delete.mockResolvedValue(undefined);

      await service.delete(1);
      expect(postDomain.delete).toHaveBeenCalledWith(1);
    });
  });
});
