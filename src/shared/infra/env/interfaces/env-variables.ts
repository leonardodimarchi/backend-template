export enum EnvVariableKeys {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
  MAIL_FROM = 'MAIL_FROM',
  AWS_REGION = 'AWS_REGION',
}

export type EnvVariables = {
  [EnvVariableKeys.DB_HOST]: string;
  [EnvVariableKeys.DB_PORT]: number;
  [EnvVariableKeys.DB_USERNAME]: string;
  [EnvVariableKeys.DB_PASSWORD]: string;
  [EnvVariableKeys.DB_DATABASE]: string;
  [EnvVariableKeys.JWT_SECRET]: string;
  [EnvVariableKeys.JWT_EXPIRES_IN]: string;
  [EnvVariableKeys.MAIL_FROM]: string;
  [EnvVariableKeys.AWS_REGION]: string;
};
