module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
      '**/__tests__/**/*.ts',
      '**/?(*.)+(spec|test).ts'
    ],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
      '@shared/(.*)': '<rootDir>/src/shared/$1',
      '@inventory/(.*)': '<rootDir>/src/inventory-service/$1',
      '@order/(.*)': '<rootDir>/src/order-service/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts']
  };