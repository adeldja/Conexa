module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: { jsx: 'react-jsx', module: 'commonjs' }
          }
        ]
      },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@conexa/ui$': '<rootDir>/../../packages/ui/src/index.ts',
      '^@conexa/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['<rootDir>/__tests__/**/*.test.(ts|tsx|js)']
  };