/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testMatch: [
    "**/test/**/*.test.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/extension.ts", "!**/*.types.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["./setup-jest.ts"]
};