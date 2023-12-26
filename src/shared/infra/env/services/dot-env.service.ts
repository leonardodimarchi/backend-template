import { Injectable } from '@nestjs/common';
import { config as initDotEnv } from 'dotenv';
import { ValidatorSpec, cleanEnv, email, port, str } from 'envalid';
import { EnvVariableKeys, EnvVariables } from '../interfaces/env-variables';
import { EnvService } from '../interfaces/env.service';

type EnvSpecs = {
  [K in EnvVariableKeys]: ValidatorSpec<EnvVariables[K]>;
};

@Injectable()
export class DotEnvService implements EnvService {
  constructor() {
    initDotEnv();
    const env = cleanEnv(process.env, DotEnvService.dotEnvSpecs);

    this.env = env;
  }

  static dotEnvSpecs: EnvSpecs = {
    [EnvVariableKeys.DB_HOST]: str(),
    [EnvVariableKeys.DB_PORT]: port(),
    [EnvVariableKeys.DB_USERNAME]: str(),
    [EnvVariableKeys.DB_PASSWORD]: str(),
    [EnvVariableKeys.DB_DATABASE]: str(),
    [EnvVariableKeys.JWT_SECRET]: str(),
    [EnvVariableKeys.JWT_EXPIRES_IN]: str(),
    [EnvVariableKeys.MAIL_FROM]: email(),
    [EnvVariableKeys.AWS_REGION]: str(),
  };

  private readonly env: EnvVariables;

  get<K extends EnvVariableKeys>(key: K): EnvVariables[K] {
    return this.env[key];
  }

  getAll(): EnvVariables {
    return this.env;
  }
}
