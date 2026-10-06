import { DataSourceOptions } from 'typeorm';
import { getEnv, getPort } from '../config/env';

export function getDatabaseConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: getEnv('DB_HOST'),
    port: getPort('DB_PORT'),
    username: getEnv('POSTGRES_USER'),
    password: getEnv('POSTGRES_PASSWORD'),
    database: getEnv('POSTGRES_DB'),
  };
}
