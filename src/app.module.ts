import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule],
  providers: [],
})
export class AppModule {}
