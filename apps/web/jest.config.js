module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@conexa/ui$': '<rootDir>/../../packages/ui/src/index.ts',
      '^@conexa/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1'
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: [
      '<rootDir>/__tests__/**/*.(ts|tsx|js)',
      '<rootDir>/?(*.)+(spec|test).(ts|tsx|js)'
    ]
  };