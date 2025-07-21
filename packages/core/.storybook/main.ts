import type { StorybookConfig } from "@storybook/react-vite"

import { join, dirname } from "path"

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")))
}
const config: StorybookConfig = {
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@chromatic-com/storybook"),
    // getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@vueless/storybook-dark-mode"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("storybook-addon-tag-badges"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: "sb-vite.config.ts",
      },
    },
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  staticDirs: ["../public"],
}
export default config
