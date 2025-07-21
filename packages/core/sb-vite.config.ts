import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  process.env = { ...process.env, ...env }
  return {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      {
        name: "fix-storybook-modules",
        enforce: "pre",
      },
    ],
    build: {
      target: ["esnext"], // 设置为 esnext 以支持顶层 await
      rollupOptions: {
        // 忽略 eval 警告
        onwarn(warning, warn) {
          if (warning.code === "EVAL" || warning.message?.includes("Use of eval")) {
            return
          }
          warn(warning)
        },
      },
    },
    resolve: {
      alias: {
        "@storybook/addons": "@storybook/manager-api",
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext", // 设置 esbuild 目标也为 esnext
        loader: {
          ".mjs": "js",
        },
      },
    },
  }
})
