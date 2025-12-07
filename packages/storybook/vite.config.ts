import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from "path";

const coreDir = path.resolve(__dirname, "../core");

const createWorkspaceAliases = (baseDir: string): Record<string, string> => {
  const aliases: Record<string, string> = {};
  if (!fs.existsSync(baseDir)) return aliases;

  for (const entry of fs.readdirSync(baseDir)) {
    const pkgDir = path.join(baseDir, entry);
    const pkgJsonPath = path.join(pkgDir, "package.json");
    if (!fs.existsSync(pkgJsonPath)) continue;

    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as {
      name?: string;
    };
    if (pkg.name) {
      aliases[pkg.name] = path.join(pkgDir, "src");
    }
  }

  return aliases;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  const componentAliases = createWorkspaceAliases(
    path.resolve(coreDir, "app/components")
  );
  const hookAliases = createWorkspaceAliases(
    path.resolve(coreDir, "app/hooks")
  );
  const utilAliases = createWorkspaceAliases(
    path.resolve(coreDir, "app/utils")
  );

  return {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      {
        name: "fix-storybook-modules",
        enforce: "pre",
        transform(code, id) {
          if (
            (id.includes("@tanstack/react-query") ||
              id.includes("framer-motion") ||
              id.includes("node_modules")) &&
            (code.includes('"use client"') || code.includes("'use client'"))
          ) {
            return {
              code: code.replace(/^['"]use client['"];?\s*/m, ""),
              map: null,
            };
          }
        },
      },
    ],
    build: {
      target: ["esnext"],
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "EVAL" ||
            warning.message?.includes("Use of eval")
          ) {
            return;
          }
          warn(warning);
        },
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            storybook: ["@storybook/react"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "@storybook/addons": "@storybook/manager-api",
        // styles 路径需要在主包之前，否则会被错误解析
        "@choiceform/design-system/styles": path.resolve(coreDir, "app/styles"),
        "@choiceform/design-system": path.resolve(coreDir, "app/index.ts"),
        "@choiceform/design-shared": path.resolve(
          __dirname,
          "../shared/src/index.ts"
        ),
        "~": path.resolve(coreDir, "app"),
        ...componentAliases,
        ...hookAliases,
        ...utilAliases,
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
        loader: {
          ".mjs": "js",
        },
      },
    },
  };
});
