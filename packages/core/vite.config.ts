import { resolve } from "path"
import { ConfigEnv, defineConfig, UserConfig } from "vite"
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
      react(),
      tsconfigPaths(),
      dts({
        include: ["app"],
        exclude: ["app/routes", "**/*.stories.tsx", "**/*.test.tsx", "app/components/experimental"],
        rollupTypes: true,
        copyDtsFiles: true,
      }),
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
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "@legendapp/state",
          "@radix-ui/react-primitive",
          "@radix-ui/react-portal",
          "@radix-ui/react-slot",
          "@radix-ui/react-use-callback-ref",
          "@radix-ui/react-use-controllable-state",
          "@radix-ui/react-use-layout-effect",
          "@radix-ui/react-use-size",
          "@radix-ui/react-context",
          "@radix-ui/react-collection",
          "@radix-ui/react-compose-refs",
          "@radix-ui/react-direction",
          "@radix-ui/react-dismissable-layer",
          "@radix-ui/react-focus-guards",
          "@radix-ui/react-focus-scope",
          "@radix-ui/react-id",
          "@radix-ui/react-popper",
          "@radix-ui/react-presence",
          "@radix-ui/react-roving-focus",
          "@radix-ui/react-tooltip",
          "@radix-ui/react-visually-hidden",
          "@floating-ui/react",
          "@floating-ui/dom",
          "ahooks",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
          "tailwind-variants",
          "is-hotkey",
        ],
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
      sourcemap: true,
      minify: false,
      emptyOutDir: true,
    },
  }
})
