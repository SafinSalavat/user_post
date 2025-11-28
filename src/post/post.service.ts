import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDomain } from './post.domain';
import {
  PostCreateRequestDto,
  PostQueryFilterRequestDto,
  PostUpdateRequestDto,
} from './dto/request/post-request.dto';
import {
  GetOnePostResponse,
  PaginatedResponseDto,
} from './dto/response/post-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postDomain: PostDomain,
    private readonly userService: UserService,
  ) {}

  async create(
    dto: PostCreateRequestDto,
    authorId: number,
  ): Promise<GetOnePostResponse> {
    await this.userService.getOne(authorId);
    const post = await this.postDomain.create(dto, authorId);

    return GetOnePostResponse.map(post);
  }

  async getOne(id: number): Promise<GetOnePostResponse> {
    const post = await this.postDomain.findOne(id);
    if (!post) {
      throw new NotFoundException('Такой статьи не существует');
    }

    return GetOnePostResponse.map(post);
  }

  async getMany(
    dto: PostQueryFilterRequestDto,
  ): Promise<PaginatedResponseDto<GetOnePostResponse>> {
    const posts = await this.postDomain.findMany(dto);

    return {
      ...posts,
      data: posts.data.map((val) => GetOnePostResponse.map(val)),
    };
  }

  async update(
    id: number,
    dto: PostUpdateRequestDto,
  ): Promise<GetOnePostResponse> {
    await this.getOne(id);

    const updated = await this.postDomain.update(id, dto);
    return GetOnePostResponse.map(updated);
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);

    await this.postDomain.delete(id);
  }
}
