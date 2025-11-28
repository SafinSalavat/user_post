import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import {
  PostCreateRequestDto,
  PostQueryFilterRequestDto,
  PostUpdateRequestDto,
} from './dto/request/post-request.dto';
import { PaginatedResponseDto } from './dto/response/post-response.dto';
import { DateTime } from 'luxon';

@Injectable()
export class PostDomain {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOne(id: number): Promise<Post | null> {
    return this.postRepository
      .createQueryBuilder()
      .select()
      .where({ id })
      .getOne();
  }

  async findMany(
    dto: PostQueryFilterRequestDto,
  ): Promise<PaginatedResponseDto<Post>> {
    const qb = this.postRepository.createQueryBuilder('p');
    qb.select();

    if (dto.authorId) {
      qb.andWhere('p.authorId = :authorId', { authorId: dto.authorId });
    }

    if (dto.title) {
      qb.andWhere('p.title ILIKE :title', { title: `%${dto.title}%` });
    }

    if (dto.publishedAt) {
      const dt = DateTime.fromISO(dto.publishedAt, { zone: 'utc' });
      const startOfDay = dt.startOf('day').toISO();
      const endOfDay = dt.endOf('day').toISO();

      qb.andWhere('p.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }

    qb.skip((dto.page - 1) * dto.limit);
    qb.take(dto.limit);
    qb.orderBy('p.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / dto.limit);
    const nextPage = dto.page < totalPages ? dto.page + 1 : null;
    const prevPage = dto.page > 1 ? dto.page - 1 : null;
    return {
      page: dto.page,
      limit: dto.limit,
      total,
      nextPage,
      prevPage,
      data,
    };
  }

  async findOneOrFail(id: number): Promise<Post> {
    return this.postRepository
      .createQueryBuilder()
      .select()
      .where({ id })
      .getOneOrFail();
  }

  async create(dto: PostCreateRequestDto, authorId: number): Promise<Post> {
    const result = await this.postRepository
      .createQueryBuilder()
      .insert()
      .values({
        title: dto.title,
        description: dto.description,
        authorId,
      })
      .returning('*')
      .execute();

    return result.generatedMaps[0] as Post;
  }

  async update(id: number, dto: PostUpdateRequestDto): Promise<Post> {
    const updateValues: Partial<Post> = {};

    if (dto.title) updateValues.title = dto.title;
    if (dto.description) updateValues.description = dto.description;

    await this.postRepository
      .createQueryBuilder()
      .update()
      .set(updateValues)
      .where({ id })
      .execute();

    return this.findOneOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();
  }
}
