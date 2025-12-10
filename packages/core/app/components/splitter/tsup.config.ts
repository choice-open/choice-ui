import { defineConfig } from "tsup"
import { resolve } from "path"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime", /^@choice-ui\//, /^@choiceform\//],
  splitting: false,
  sourcemap: false,
  minify: false,
  esbuildOptions(options) {
    options.alias = { "~": resolve(__dirname, "../../../") }
  },
})
