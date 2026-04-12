/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setup-tests.ts"],
    include: ["**/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
      "@choice-ui/shared": resolve(__dirname, "../shared/src"),
    },
  },
})
