import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: [join(__dirname, 'migrations', '*.ts')],
  entities: [join(__dirname, '../../../../modules', '**', '*.schema.{ts,js}')],
  synchronize: false,
};
