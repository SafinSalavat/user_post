import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangeUserPasswordRequestDto,
  UserCreateRequestDto,
  UserUpdateRequestDto,
} from './dto/request/user-request.dto';
import {
  BasicMessageResponse,
  GetOneUserResponse,
} from './dto/response/user-response.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiBody({ type: UserCreateRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Пользователь успешно создан',
    type: GetOneUserResponse,
  })
  create(@Body() dto: UserCreateRequestDto): Promise<GetOneUserResponse> {
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по идентификатору' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Идентификатор пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь найден',
    type: GetOneUserResponse,
  })
  getOne(@Param('id') id: number): Promise<GetOneUserResponse> {
    return this.userService.getOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiBody({ type: UserUpdateRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно обновлён',
    type: GetOneUserResponse,
  })
  update(
    @Param('id') id: number,
    @Body() dto: UserUpdateRequestDto,
  ): Promise<GetOneUserResponse> {
    return this.userService.update(+id, dto);
  }

  @Patch(':id/changePassword')
  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiBody({ type: ChangeUserPasswordRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пароль обновлён',
    example: {
      message: 'Пароль успешно изменен',
    },
  })
  changePassword(
    @Param('id') id: number,
    @Body() dto: ChangeUserPasswordRequestDto,
  ): Promise<BasicMessageResponse> {
    return this.userService.changePassword(+id, dto.password);
  }
}
