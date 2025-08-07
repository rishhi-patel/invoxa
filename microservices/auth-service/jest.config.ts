import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!src/utils/**",
    "!src/index.ts",
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 75,
  //     functions: 75,
  //     lines: 75,
  //     statements: 75,
  //   },
  // },
}

export default config
