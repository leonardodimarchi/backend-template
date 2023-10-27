import { DataSource } from 'typeorm';
import { getDatasourceOptions } from './datasource-options';

import { DotEnvService } from '@shared/infra/env/services/dot-env.service';
import { config as initDotEnv } from 'dotenv';
import { cleanEnv } from 'envalid';

initDotEnv();

const env = cleanEnv(process.env, DotEnvService.dotEnvSpecs);

export default new DataSource(getDatasourceOptions(env));
