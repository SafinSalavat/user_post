import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import {
  PostCreateRequestDto,
  PostQueryFilterRequestDto,
  PostUpdateRequestDto,
} from './dto/request/post-request.dto';
import {
  GetOnePostResponse,
  PaginatedResponseDto,
} from './dto/response/post-response.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { UserPayload } from 'src/core/decorator/user-payload.decorator';
import { PayloadDto } from 'src/core/dto/payload.dto';

@Controller('posts')
@ApiTags('Posts')
@ApiExtraModels(PaginatedResponseDto, GetOnePostResponse)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новой статьи' })
  @ApiBody({ type: PostCreateRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Статья успешно создана',
    type: GetOnePostResponse,
  })
  create(
    @Body() dto: PostCreateRequestDto,
    @UserPayload() payload: PayloadDto,
  ): Promise<GetOnePostResponse> {
    return this.postService.create(dto, payload.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Получение списка статей с фильтрацией и пагинацией',
  })
  @Public()
  @ApiResponse({
    description: 'Список постов с пагинацией',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(GetOnePostResponse) },
            },
          },
        },
      ],
    },
  })
  getMany(
    @Query() dto: PostQueryFilterRequestDto,
  ): Promise<PaginatedResponseDto<GetOnePostResponse>> {
    return this.postService.getMany(dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить статью по идентификатору' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Идентификатор статьи',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статья найдена',
    type: GetOnePostResponse,
  })
  getOne(@Param('id') id: number): Promise<GetOnePostResponse> {
    return this.postService.getOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить данные статьи' })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiBody({ type: PostUpdateRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статья успешно обновлена',
    type: GetOnePostResponse,
  })
  update(
    @Param('id') id: number,
    @Body() dto: PostUpdateRequestDto,
  ): Promise<GetOnePostResponse> {
    return this.postService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Идентификатор статьи',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Статья успешно удалена',
  })
  async delete(@Param('id') id: number): Promise<void> {
    await this.postService.delete(+id);
  }
}
