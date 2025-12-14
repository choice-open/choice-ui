import { resolve } from "path"
import { ConfigEnv, defineConfig, type PluginOption, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import fs from "fs/promises"
import path from "path"
import pkg from "./package.json"

// ============================================================================
// 常量配置
// ============================================================================

const ROOT_DIR = __dirname
const APP_DIR = resolve(ROOT_DIR, "app")
const DIST_DIR = resolve(ROOT_DIR, "dist")
const SHARED_DIR = resolve(ROOT_DIR, "../shared/src")

// 从 package.json 自动获取所有外部依赖
const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 递归复制目录
 */
async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

/**
 * 安全复制文件，忽略不存在的文件
 */
async function safeCopyFile(src: string, dest: string, description: string): Promise<void> {
  try {
    await fs.copyFile(src, dest)
    console.log(`✓ ${description} copied successfully`)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn(`⚠ ${description} not found, skipping...`)
    } else {
      console.error(`Error copying ${description}:`, err)
    }
  }
}

/**
 * 生成文件名
 */
function generateFileName(fileName: string, extension: string): string {
  // 处理 shared 包的文件
  if (fileName.includes("shared/src")) {
    return `shared/${fileName.replace(/.*shared\/src\//, "").replace(/\.tsx?$/, "")}.${extension}`
  }
  // 处理 app 目录的文件
  return `${fileName.replace("app/", "")}.${extension}`
}

/**
 * 检查依赖是否应该外部化
 * 所有 dependencies 和 peerDependencies 都不打包
 */
function isExternal(id: string): boolean {
  // 内部路径不外部化
  if (id.startsWith(".") || id.startsWith("/") || id.startsWith("~")) {
    return false
  }
  // @choice-ui/shared 打包进来（因为我们用 alias 指向源码）
  if (id === "@choice-ui/shared") {
    return false
  }
  // 检查是否是外部依赖
  return externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))
}

// ============================================================================
// 插件配置
// ============================================================================

/**
 * 复制构建资源的插件
 */
function createCopyAssetsPlugin(): PluginOption {
  return {
    name: "copy-assets",
    async writeBundle() {
      // 复制 tailwind.css
      await safeCopyFile(
        resolve(APP_DIR, "tailwind.css"),
        resolve(DIST_DIR, "tailwind.css"),
        "tailwind.css",
      )

      // 复制 styles 目录
      const stylesDir = resolve(APP_DIR, "styles")
      const destStylesDir = resolve(DIST_DIR, "styles")

      try {
        await copyDir(stylesDir, destStylesDir)
        console.log("✓ Styles directory copied successfully")
      } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
          console.error("Error copying styles directory:", err)
        }
      }

      // 复制 llms.txt
      await safeCopyFile(resolve(ROOT_DIR, "llms.txt"), resolve(DIST_DIR, "llms.txt"), "llms.txt")
    },
  }
}

/**
 * DTS 插件配置
 */
function createDtsPlugin(): PluginOption {
  return dts({
    include: ["app/**/*.ts", "app/**/*.tsx"],
    exclude: ["app/routes", "**/*.stories.tsx", "**/*.test.tsx", "**/__tests__/**"],
    outDir: "dist",
    root: ROOT_DIR,
    entryRoot: "app",
    rollupTypes: false,
    copyDtsFiles: true,
    tsconfigPath: resolve(ROOT_DIR, "tsconfig.json"),
    afterBuild: async () => {
      // 1. 复制 shared 已构建的类型文件
      const sharedDistSrc = resolve(ROOT_DIR, "../shared/dist/index.d.ts")
      const sharedDestDir = resolve(DIST_DIR, "shared")
      await fs.mkdir(sharedDestDir, { recursive: true })
      await fs.copyFile(sharedDistSrc, resolve(sharedDestDir, "index.d.ts"))
      console.log("✓ Shared types copied")

      // 2. 修复 index.d.ts 中的 shared 引用
      const indexDts = resolve(DIST_DIR, "index.d.ts")
      let content = await fs.readFile(indexDts, "utf-8")
      content = content.replace(
        /export \* from ['"]\.\.\/\.\.\/shared\/src\/hooks['"];?\nexport \* from ['"]\.\.\/\.\.\/shared\/src\/utils['"];?/g,
        "export * from './shared';",
      )
      content = content.replace(/from ['"]\.\.\/\.\.\/shared\/src\//g, "from './shared/")
      await fs.writeFile(indexDts, content)

      // 3. 修复组件类型文件中的 @choice-ui/* 引用
      await fixDtsImports(resolve(DIST_DIR, "components"))
      console.log("✓ Fixed type imports")
    },
  })
}

/**
 * 递归修复 .d.ts 文件中的 @choice-ui/* 引用
 */
async function fixDtsImports(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await fixDtsImports(fullPath)
    } else if (entry.name.endsWith(".d.ts")) {
      let content = await fs.readFile(fullPath, "utf-8")
      const original = content

      // 计算从当前文件到 components 目录的相对路径深度
      const relPath = path.relative(resolve(DIST_DIR, "components"), path.dirname(fullPath))
      const depth = relPath ? relPath.split(path.sep).length : 0
      const prefix = depth > 0 ? "../".repeat(depth) : "./"

      // 替换 @choice-ui/xxx 为相对路径
      content = content.replace(/@choice-ui\/([a-z-]+)/g, (_, pkg) => `${prefix}${pkg}/src`)

      if (content !== original) {
        await fs.writeFile(fullPath, content)
      }
    }
  }
}

// ============================================================================
// Vite 配置
// ============================================================================

export default defineConfig(({ mode: _mode }: ConfigEnv): UserConfig => {
  return {
    define: {
      "import.meta.env.VERSION": JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        "~": APP_DIR,
        "@choice-ui/shared": SHARED_DIR,
      },
    },
    plugins: [
      react(),
      tsconfigPaths(),
      createDtsPlugin(),
      libInjectCss(),
      tailwindcss(),
      createCopyAssetsPlugin(),
    ],
    publicDir: false,
    build: {
      lib: {
        entry: resolve(APP_DIR, "index.ts"),
        name: "ChoiceformDesignSystem",
        formats: ["es"],
        fileName: () => "index.js",
      },
      rollupOptions: {
        external: isExternal,
        output: {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "app",
          entryFileNames: ({ name: fileName }) => generateFileName(fileName, "js"),
        },
      },
      sourcemap: false,
      minify: false,
      emptyOutDir: true,
    },
  }
})
