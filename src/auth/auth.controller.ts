import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequestDto,
  RefreshRequestDto,
} from './dto/request/auth-request.dto';
import { UserCreateRequestDto } from 'src/user/dto/request/user-request.dto';
import { TokensResponseDto } from './dto/response/auth-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/core/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: TokensResponseDto,
  })
  async login(@Body() dto: LoginRequestDto): Promise<TokensResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: UserCreateRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: TokensResponseDto,
  })
  async register(
    @Body() dto: UserCreateRequestDto,
  ): Promise<TokensResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Обновление Access и Refresh токенов' })
  @ApiBody({
    type: RefreshRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: TokensResponseDto,
  })
  async refresh(@Body() dto: RefreshRequestDto): Promise<TokensResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }
}
