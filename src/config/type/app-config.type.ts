export type TAppConfig = {
  PORT: number;
};

export type TDatabaseConfig = {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
};

export type TJWTConfig = {
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: number;
};

export type TRedisConfig = {
  REDIS_HOST: string;
  REDIS_PORT: number;
};
