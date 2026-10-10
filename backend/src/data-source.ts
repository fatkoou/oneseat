import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database/database.config';

config({ path: '../.env' });

const extension = __filename.endsWith('.ts') ? 'ts' : 'js';

export default new DataSource({
  ...getDatabaseConfig(),
  entities: [join(__dirname, '**', `*.entity.${extension}`)],
  migrations: [join(__dirname, 'migrations', `*.${extension}`)],
});
