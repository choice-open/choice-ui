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

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@choice-ui/react"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      // styles 路径需要在主包之前
      "@choice-ui/react/styles": path.resolve(coreDir, "app/styles"),
      "@choice-ui/react": path.resolve(coreDir, "app/index.ts"),
      "@choice-ui/shared": path.resolve(__dirname, "../shared/src/index.ts"),
      "~": path.resolve(coreDir, "app"),
      ...componentAliases,
      ...hookAliases,
      ...utilAliases,
    }
    return config
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
