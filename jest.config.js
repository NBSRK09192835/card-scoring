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
  transformIgnorePatterns: ['node_modules/(?!(jest-preset-angular|@angular)/)']
};
