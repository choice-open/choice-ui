import path from "path"
import fs from "fs"
import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const coreDir = path.resolve(__dirname, "../core")

// 动态创建 workspace 内部包的别名
function createWorkspaceAliases(baseDir: string): Record<string, string> {
  const aliases: Record<string, string> = {}
  if (!fs.existsSync(baseDir)) return aliases

  for (const entry of fs.readdirSync(baseDir)) {
    const pkgDir = path.join(baseDir, entry)
    const pkgJsonPath = path.join(pkgDir, "package.json")
    if (!fs.existsSync(pkgJsonPath)) continue

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
      if (pkg.name) {
        aliases[pkg.name] = path.join(pkgDir, "src")
      }
    } catch {
      // ignore
    }
  }
  return aliases
}

const componentAliases = createWorkspaceAliases(path.resolve(coreDir, "app/components"))
const hookAliases = createWorkspaceAliases(path.resolve(coreDir, "app/hooks"))
const utilAliases = createWorkspaceAliases(path.resolve(coreDir, "app/utils"))

// 共享的模块别名（绝对路径，用于 webpack）
const workspaceAliases: Record<string, string> = {
  // styles 路径需要在主包之前
  "@choice-ui/react/styles": path.resolve(coreDir, "app/styles"),
  "@choice-ui/react": path.resolve(coreDir, "app/index.ts"),
  "@choice-ui/shared": path.resolve(__dirname, "../shared/src/index.ts"),
  "~": path.resolve(coreDir, "app"),
  ...componentAliases,
  ...hookAliases,
  ...utilAliases,
}

// Turbopack 不支持绝对路径别名，需转换为相对 docs 目录的路径
const turbopackAliases: Record<string, string> = Object.fromEntries(
  Object.entries(workspaceAliases).map(([key, value]) => [
    key,
    path.relative(__dirname, value),
  ]),
)

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@choice-ui/react"],
  turbopack: {
    resolveAlias: turbopackAliases,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      ...workspaceAliases,
    }
    return config
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
