import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  constructor(private readonly configService: AppConfigService) {}

  onModuleInit() {
    const { REDIS_HOST, REDIS_PORT } = this.configService.redisConfig;

    this.redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });

    this.redis.on('connect', () => console.log('Успешное подключение к Redis'));
    this.redis.on('error', (err) =>
      console.error('Ошибка подключения к Redis', err),
    );
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async get<T>(key: string): Promise<T | undefined> {
    const data = await this.redis.get(key);
    if (!data) return undefined;
    if (data === 'null') return null as T;
    return JSON.parse(data) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    let data: string = JSON.stringify(value);
    if (value === null) {
      data = 'null';
    }

    if (ttlSeconds) {
      await this.redis.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, data);
    }
  }

  async clear(): Promise<void> {
    await this.redis.flushdb();
  }
}
