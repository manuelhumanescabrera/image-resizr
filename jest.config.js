module.exports = {
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.js', 'functions/**/*.js'],
  coverageReporters: ['json', 'lcov', 'cobertura', 'text'],
  coveragePathIgnorePatterns: [
    'src/index.js',
    'src/constants',
    'src/routes/*.js',
    'src/model'
  ]
};
