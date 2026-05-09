module.exports = {
  displayName: 'nbs-card-scoring-frontend',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  coverageDirectory: './coverage',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html', 'mjs'],
  transformIgnorePatterns: ['node_modules/(?!(jest-preset-angular|@angular)/)'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/test-setup.ts',
    '!src/environments/**',
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
  ],
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
