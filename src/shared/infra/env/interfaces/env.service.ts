import { EnvVariableKeys, EnvVariables } from './env-variables';

export abstract class EnvService {
  abstract get<K extends EnvVariableKeys>(key: K): EnvVariables[K];
  abstract getAll(): EnvVariables;
}
