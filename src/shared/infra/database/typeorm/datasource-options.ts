import { EnvVariables } from '@shared/infra/env/interfaces/env-variables';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const getDatasourceOptions = (env: EnvVariables): DataSourceOptions => {
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    migrations: [join(__dirname, 'migrations', '*.ts')],
    entities: [
      join(__dirname, '../../../../modules', '**', '*.schema.{ts,js}'),
    ],
    synchronize: false,
  };
};
