import { resolve } from "path"
import { ConfigEnv, defineConfig, PluginOption, UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import fs from "fs/promises"
import path from "path"

async function copyDir(src: string, dest: string) {
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

export default defineConfig(({ mode: _mode }: ConfigEnv): UserConfig => {
  return {
    define: {
      "import.meta.env.VERSION": JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        "~": resolve(__dirname, "./app"),
      },
    },
    plugins: [
      react() as PluginOption,
      tsconfigPaths() as PluginOption,
      dts({
        include: ["app"],
        exclude: ["app/routes", "**/*.stories.tsx", "**/*.test.tsx"],
        rollupTypes: false,
        copyDtsFiles: true,
      }) as PluginOption,
      libInjectCss(),
      tailwindcss(),
      {
        name: "copy-assets",
        async writeBundle() {
          // 复制 tailwind.css
          await fs.copyFile(
            resolve(__dirname, "app/tailwind.css"),
            resolve(__dirname, "dist/tailwind.css"),
          )

          // 复制整个 styles 目录
          const stylesDir = resolve(__dirname, "app/styles")
          const destStylesDir = resolve(__dirname, "dist/styles")

          try {
            await copyDir(stylesDir, destStylesDir)
            console.log("✓ Styles directory copied successfully")
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.error("Error copying styles directory:", err)
            }
          }

          // 复制 llms.txt 文件
          const llmsFile = resolve(__dirname, "llms.txt")
          const destLlmsFile = resolve(__dirname, "dist/llms.txt")

          try {
            await fs.copyFile(llmsFile, destLlmsFile)
            console.log("✓ llms.txt copied successfully")
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.error("Error copying llms.txt:", err)
            } else {
              console.warn("⚠ llms.txt not found, skipping...")
            }
          }
        },
      },
    ],
    build: {
      lib: {
        entry: resolve(__dirname, "app/index.ts"),
        name: "ChoiceformDesignSystem",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
      },
      rollupOptions: {
        external: (id) => {
          // Always externalize React
          if (id === "react" || id === "react-dom" || id === "react/jsx-runtime") {
            return true
          }

          // Externalize all dependencies and their subpaths
          const dependencies = [
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
            "lodash",
            "lodash-es",
            "lodash.debounce",
            "nanoid",
            "prettier",
            "slate",
            "sonner",
            "tinycolor2",
            "usehooks-ts",
            "xss",
            "zod",
          ]

          // Check if the id starts with any of the dependencies
          return dependencies.some((dep) => id.startsWith(dep))
        },
        output: [
          {
            format: "es",
            dir: "dist/esm",
            preserveModules: true,
            preserveModulesRoot: "app",
            entryFileNames: ({ name: fileName }) => {
              if (fileName.includes("node_modules")) {
                const parts = fileName.split("node_modules/").pop()!.split("/")
                const pkgName = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0]
                const restPath = parts.slice(pkgName.startsWith("@") ? 2 : 1).join("-")
                return `_vendor/${pkgName}/${restPath}.js`
              }
              return `${fileName.replace("app/", "")}.js`
            },
          },
          {
            format: "cjs",
            dir: "dist/cjs",
            preserveModules: true,
            preserveModulesRoot: "app",
            exports: "named",
            entryFileNames: ({ name: fileName }) => {
              if (fileName.includes("node_modules")) {
                const parts = fileName.split("node_modules/").pop()!.split("/")
                const pkgName = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0]
                const restPath = parts.slice(pkgName.startsWith("@") ? 2 : 1).join("-")
                return `_vendor/${pkgName}/${restPath}.cjs`
              }
              return `${fileName.replace("app/", "")}.cjs`
            },
          },
        ],
      },
      sourcemap: false,
      minify: false,
      emptyOutDir: true,
    },
  }
})
