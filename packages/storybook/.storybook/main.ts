import type { StorybookConfig } from "@storybook/react-vite";
import { createStorybookConfig } from "./create-storybook-config";

const config: StorybookConfig = createStorybookConfig({
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  viteConfigPath: "vite.config.ts",
  staticDirs: ["../public"],
});

export default config;
