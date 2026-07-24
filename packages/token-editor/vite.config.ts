import fs from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const coreDir = path.resolve(__dirname, "../core")
const sharedDir = path.resolve(__dirname, "../shared")

/**
 * Each `packages/core/app/components/<name>` is its own workspace package
 * (`@choice-ui/<name>`), but only ships a `dist/index.d.ts` — Vite can't
 * find a runtime entry for them in a production build. Mirror storybook's
 * approach: rewrite every `@choice-ui/<name>` import to that component's
 * `src/` so Vite resolves source directly.
 */
function createWorkspaceAliases(baseDir: string): Record<string, string> {
  const aliases: Record<string, string> = {}
  if (!fs.existsSync(baseDir)) return aliases
  for (const entry of fs.readdirSync(baseDir)) {
    const pkgJsonPath = path.join(baseDir, entry, "package.json")
    if (!fs.existsSync(pkgJsonPath)) continue
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as { name?: string }
    if (pkg.name) aliases[pkg.name] = path.join(baseDir, entry, "src")
  }
  return aliases
}

const componentAliases = createWorkspaceAliases(path.resolve(coreDir, "app/components"))

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@choice-ui/react/styles": path.resolve(coreDir, "app/styles"),
      "@choice-ui/react": path.resolve(coreDir, "app/index.ts"),
      "@choice-ui/shared": path.resolve(sharedDir, "src/index.ts"),
      ...componentAliases,
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    port: 5180,
  },
})
