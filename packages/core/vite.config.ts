import { resolve } from "path"
import { ConfigEnv, defineConfig, type PluginOption, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import fs from "fs/promises"
import path from "path"

// ============================================================================
// 常量配置
// ============================================================================

const ROOT_DIR = __dirname
const APP_DIR = resolve(ROOT_DIR, "app")
const DIST_DIR = resolve(ROOT_DIR, "dist")
const SHARED_DIR = resolve(ROOT_DIR, "../shared/src")

// React 相关的外部依赖
const REACT_DEPS = ["react", "react-dom", "react/jsx-runtime"]

// 需要外部化的依赖包（不打包进 bundle）
const EXTERNAL_DEPENDENCIES = [
  "@choiceform/icons-react",
  "@choiceform/design-tokens",
  "@codemirror",
  "@date-fns",
  "@floating-ui",
  "@legendapp",
  "@lezer",
  "@replit",
  "@tanstack",
  "@typescript",
  "ahooks",
  "allotment",
  "comlink",
  "date-fns",
  "es-toolkit",
  "framer-motion",
  "is-hotkey",
  "lodash-es",
  "nanoid",
  "prettier",
  "slate",
  "sonner",
  "tinycolor2",
  "usehooks-ts",
  "xss",
  "zod",
  "shiki",
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
 * 生成文件名（处理 node_modules 和 shared 包的特殊路径）
 */
function generateFileName(fileName: string, extension: string): string {
  // 处理 node_modules 中的文件
  if (fileName.includes("node_modules")) {
    const parts = fileName.split("node_modules/").pop()!.split("/")
    const pkgName = parts[0]!.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0]!
    const restPath = parts.slice(pkgName.startsWith("@") ? 2 : 1).join("-")
    return `_vendor/${pkgName}/${restPath}.${extension}`
  }

  // 处理 shared 包的文件
  if (fileName.includes("shared/src")) {
    return `shared/${fileName.replace(/.*shared\/src\//, "").replace(/\.tsx?$/, "")}.${extension}`
  }

  // 处理 app 目录的文件
  return `${fileName.replace("app/", "")}.${extension}`
}

/**
 * 检查依赖是否应该外部化
 */
function isExternal(id: string): boolean {
  // React 相关依赖始终外部化
  if (REACT_DEPS.some((dep) => id === dep || id.startsWith(`${dep}/`))) {
    return true
  }

  // 检查是否匹配外部依赖列表
  return EXTERNAL_DEPENDENCIES.some((dep) => id.startsWith(dep))
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
    include: ["app", "../shared/src"],
    exclude: ["app/routes", "**/*.stories.tsx", "**/*.test.tsx"],
    rollupTypes: false,
    copyDtsFiles: true,
    compilerOptions: {
      paths: {
        "@choiceform/design-shared": ["../shared/src/index.ts"],
        "~/*": ["./app/*"],
      },
    },
    beforeWriteFile: (filePath, content) => {
      // 在类型定义中将 @choiceform/design-shared 导入替换为相对路径
      if (filePath.endsWith("index.d.ts") && content.includes("@choiceform/design-shared")) {
        const newContent = content.replace(
          /export \* from ["']@choiceform\/design-shared["'];?/g,
          'export * from "../../shared/src/hooks";\nexport * from "../../shared/src/utils";',
        )
        return {
          filePath,
          content: newContent,
        }
      }
    },
  })
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
        "@choiceform/design-shared": SHARED_DIR,
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
    build: {
      lib: {
        entry: resolve(APP_DIR, "index.ts"),
        name: "ChoiceformDesignSystem",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      },
      rollupOptions: {
        external: isExternal,
        output: [
          {
            format: "es",
            dir: "dist/esm",
            preserveModules: true,
            preserveModulesRoot: "app",
            entryFileNames: ({ name: fileName }) => generateFileName(fileName, "js"),
          },
          {
            format: "cjs",
            dir: "dist/cjs",
            preserveModules: true,
            preserveModulesRoot: "app",
            exports: "named",
            entryFileNames: ({ name: fileName }) => generateFileName(fileName, "cjs"),
          },
        ],
      },
      sourcemap: false,
      minify: false,
      emptyOutDir: true,
    },
  }
})
