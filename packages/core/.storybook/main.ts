import type { StorybookConfig } from "@storybook/react-vite"
import { createStorybookConfig } from "./create-storybook-config"

const config: StorybookConfig = createStorybookConfig({
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  viteConfigPath: "sb-vite.config.ts",
  staticDirs: ["../public"],
})

export default config
