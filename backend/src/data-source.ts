import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database/database.config';

config({ path: '../.env' });

export default new DataSource({
  ...getDatabaseConfig(),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
