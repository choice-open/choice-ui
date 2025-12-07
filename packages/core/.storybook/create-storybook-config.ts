import type { StorybookConfig } from "@storybook/react-vite"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"

const require = createRequire(import.meta.url)

const getAbsolutePath = (value: string): string => {
  return dirname(require.resolve(join(value, "package.json")))
}

export interface CreateStorybookConfigOptions {
  staticDirs?: string[]
  stories: string[]
  viteConfigPath: string
}

export const createStorybookConfig = ({
  stories,
  viteConfigPath,
  staticDirs = ["../public"],
}: CreateStorybookConfigOptions): StorybookConfig => ({
  stories,
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("storybook-addon-tag-badges"),
    getAbsolutePath("@vueless/storybook-dark-mode"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath,
      },
    },
  },
  typescript: {
    reactDocgen: "react-docgen-typescript" as const,
  },
  core: {
    disableWhatsNewNotifications: true,
  },
  staticDirs,
})

