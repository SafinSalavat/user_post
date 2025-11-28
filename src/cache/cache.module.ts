import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/config.module';
import { CacheService } from './cache.service';

@Module({
  imports: [AppConfigModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
