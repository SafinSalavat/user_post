import { Injectable } from '@nestjs/common';
import {
  TAppConfig,
  TDatabaseConfig,
  TJWTConfig,
  TRedisConfig,
} from './type/app-config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get databaseConfig(): TDatabaseConfig {
    const host = this.configService.get('POSTGRES_HOST') as string;
    const port = this.configService.get('POSTGRES_PORT') as number;
    const user = this.configService.get('POSTGRES_USER') as string;
    const password = this.configService.get('POSTGRES_PASSWORD') as string;
    const database = this.configService.get('POSTGRES_DB') as string;

    return {
      POSTGRES_HOST: host,
      POSTGRES_PORT: port,
      POSTGRES_USER: user,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: database,
    };
  }

  get appConfig(): TAppConfig {
    const port = this.configService.get('PORT') as number;

    return {
      PORT: port,
    };
  }

  get redisConfig(): TRedisConfig {
    const host = this.configService.get('REDIS_HOST') as string;
    const port = this.configService.get('REDIS_PORT') as number;

    return {
      REDIS_HOST: host,
      REDIS_PORT: port,
    };
  }

  get jwtConfig(): TJWTConfig {
    const secret = this.configService.get('JWT_SECRET') as string;
    const expiresIn = this.configService.get('JWT_EXPIRES_IN') as number;

    return {
      JWT_EXPIRES_IN: expiresIn,
      JWT_SECRET: secret,
    };
  }
}
