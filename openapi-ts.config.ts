import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://github.com/Agile-Software-Engineering-25/team01-backend-room-management/raw/refs/heads/master/room-management.yaml",
  output: {
    path: "src/api/generated",
    lint: "eslint",
    format: "prettier",
  },
  plugins: [
    "@hey-api/typescript",
    "@hey-api/client-fetch",
    "@tanstack/react-query",
    {
      name: "@hey-api/sdk",
      responseStyle: "data",
    },
  ],
});
