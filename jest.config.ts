import { Config } from "jest";

export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: [
    "**/test/**/*.test.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/extension.ts", "!**/*.types.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["./setup-jest.ts"],
  moduleDirectories: ["node_modules", "src"]
} satisfies Config;