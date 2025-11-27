import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const databaseConfig = config.databaseConfig;
        return {
          type: 'postgres',
          host: databaseConfig.POSTGRES_HOST,
          port: databaseConfig.POSTGRES_PORT,
          username: databaseConfig.POSTGRES_USER,
          password: databaseConfig.POSTGRES_PASSWORD,
          database: databaseConfig.POSTGRES_DB,
          autoLoadEntities: true,
          synchronize: true,
          entities: [User],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
