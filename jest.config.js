/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i":
      "<rootDir>/__mocks__/fileMock.js",
  },

  collectCoverageFrom: [
    "app/**/*.{js,jsx}",
    "src/**/*.{js,jsx}",
    "components/**/*.{js,jsx}",
    "lib/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/public/**",
  ],

  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",

  testMatch: [
    "**/__tests__/**/*.(test|spec).{js,jsx}",
    "**/*.(test|spec).{js,jsx}",
  ],

  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = config;
