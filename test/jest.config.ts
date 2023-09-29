import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  verbose: true,
  silent: false,
  collectCoverage: false,
  testPathIgnorePatterns: ['/node_modules', '/postgres-data', '/test'],
  watchPathIgnorePatterns: ['/node_modules', '/postgres-data'],
  moduleNameMapper: {
    '@modules/(.*)': ['<rootDir>/src/modules/$1'],
    '@shared/(.*)': ['<rootDir>/src/shared/$1'],
    'test/(.*)': ['<rootDir>/test/$1'],
  },
};

export default config;
