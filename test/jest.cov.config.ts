import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules', '/postgres-data', '/test'],
  coverageDirectory: './coverage',
  testTimeout: 60000,
  testPathIgnorePatterns: ['/node_modules', '/postgres-data', '/test'],
  watchPathIgnorePatterns: ['/node_modules', '/postgres-data'],
  moduleNameMapper: {
    '@modules/(.*)': ['<rootDir>/src/modules/$1'],
    '@shared/(.*)': ['<rootDir>/src/shared/$1'],
    'test/(.*)': ['<rootDir>/test/$1'],
  },
};

export default config;
