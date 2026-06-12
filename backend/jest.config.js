module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@ai-lab/shared$': '<rootDir>/../shared/src/index.ts'
  }
};
