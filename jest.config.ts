import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

module.exports = {
  preset: "ts-jest",

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  setupFiles: ["<rootDir>/jest.env.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
};
