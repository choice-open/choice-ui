import { defineConfig } from "tsup"
import { resolve } from "path"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@choiceform/design-shared", /^@choiceform\//],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  esbuildOptions(options) {
    options.alias = {
      "~": resolve(__dirname, "../../../"),
    }
  },
})
