import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-(spec|test).ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  verbose: true,
  silent: false,
  moduleNameMapper: {
    '@modules/(.*)': ['<rootDir>/src/modules/$1'],
    '@shared/(.*)': ['<rootDir>/src/shared/$1'],
    'test/(.*)': ['<rootDir>/test/$1'],
  },
};

export default config;
