export default {
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {},
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/test/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!**/node_modules/**"],
};
