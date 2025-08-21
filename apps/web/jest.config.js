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
    testMatch: [
      '<rootDir>/__tests__/**/*.test.(ts|tsx|js)',
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/app/layout.tsx',
      '!src/app/globals.css',
      '!src/instrumentation*.ts',
      '!src/app/**', // Exclure les pages Next.js
      '!src/lib/**', // Exclure les utilitaires externes
      '!src/types/**', // Exclure les types TypeScript
      '!src/utils/apiClient.ts', // Exclure les clients API non testés
      '!src/utils/date.ts', // Exclure les utilitaires de date
      '!src/utils/slotConverter.ts', // Exclure les convertisseurs
      '!src/utils/slotGenerator.ts', // Exclure les générateurs
      '!src/utils/utils.ts', // Exclure les utilitaires généraux
    ],
    coverageThreshold: {
      // Seuils spécifiques pour les fichiers testés
      './src/services/auth.ts': {
        branches: 60,
        functions: 90,
        lines: 90,
        statements: 90,
      },
      './src/components/ui/StarRating.tsx': {
        branches: 90,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      './src/components/forms/SlotForm.tsx': {
        branches: 80,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    testPathIgnorePatterns: [
      '<rootDir>/.next/',
      '<rootDir>/node_modules/',
    ],
  };