module.exports = {
  displayName: 'nbs-card-scoring-backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  coverageDirectory: '../../coverage/apps/nbs-card-scoring-backend',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  }
};
