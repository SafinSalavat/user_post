import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequestDto } from './dto/request/auth-request.dto';
import { AppConfigService } from 'src/config/config.service';
import { JwtService } from '@nestjs/jwt';
import { UserCreateRequestDto } from 'src/user/dto/request/user-request.dto';
import { TokensResponseDto } from './dto/response/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(id: number, email: string) {
    const jwtConfig = this.configService.jwtConfig;
    const accessToken = this.jwtService.sign(
      { sub: id, email: email },
      {
        secret: jwtConfig.JWT_ACCESS_SECRET,
        expiresIn: jwtConfig.JWT_ACCESS_EXPIRES_IN,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: id, email: email },
      {
        secret: jwtConfig.JWT_REFRESH_SECRET,
        expiresIn: jwtConfig.JWT_REFRESH_EXPIRES_IN,
      },
    );
    return { accessToken, refreshToken };
  }

  async login(dto: LoginRequestDto): Promise<TokensResponseDto> {
    const user = await this.userService.validateUser(dto.email, dto.password);
    return {
      message: 'Успешный вход',
      data: this.generateTokens(user.id, user.email),
    };
  }

  async register(dto: UserCreateRequestDto): Promise<TokensResponseDto> {
    const user = await this.userService.create(dto);
    const tokens = this.generateTokens(user.id, user.email);

    return {
      message: 'Пользователь успешно зарегистрирован',
      data: tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokensResponseDto> {
    try {
      const jwtConfig = this.configService.jwtConfig;

      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.JWT_ACCESS_SECRET,
      });

      return {
        message: 'Успешное обновление токенов',
        data: this.generateTokens(payload.sub, payload.email),
      };
    } catch (err) {
      throw new UnauthorizedException('Невалидный рефреш токен');
    }
  }
}
