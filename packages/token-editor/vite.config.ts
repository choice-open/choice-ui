import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const coreDir = path.resolve(__dirname, "../core")
const sharedDir = path.resolve(__dirname, "../shared")

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@choice-ui/react/styles": path.resolve(coreDir, "app/styles"),
      "@choice-ui/react": path.resolve(coreDir, "app/index.ts"),
      "@choice-ui/shared": path.resolve(sharedDir, "src/index.ts"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    port: 5180,
  },
})
