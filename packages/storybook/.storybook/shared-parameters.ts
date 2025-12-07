import { themes } from "storybook/internal/theming";
import type { Preview } from "@storybook/react-vite";

const lightTheme = {
  brandTitle: "@choiceform/design-system",
  brandUrl: "https://ui.choiceform.app",
  brandImage: "https://assets.choiceform.app/favicons/dev/brand.png",

  colorPrimary: "rgba(13, 153, 255, 1)",
  colorSecondary: "rgba(13, 153, 255, 1)",
  appBorderColor: "rgba(230, 230, 230, 1)",
  appBorderRadius: 5,
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  barBg: "rgba(255, 255, 255, 1)",
  buttonBorder: "rgba(230, 230, 230, 1)",
  barTextColor: "rgba(0, 0, 0, 1)",
};

const darkTheme = {
  brandTitle: "@choiceform/design-system",
  brandUrl: "https://ui.choiceform.app",
  brandImage: "https://assets.choiceform.app/favicons/dev/brand_dark.png",

  colorPrimary: "rgba(7, 104, 207, 1)",
  colorSecondary: "rgba(13, 153, 255, 1)",
  appBorderColor: "rgba(68, 68, 68, 1)",
  appBorderRadius: 5,
  appBg: "rgba(30, 30, 30, 1)",
  appContentBg: "rgba(30, 30, 30, 1)",
  appPreviewBg: "rgba(30, 30, 30, 1)",
  barBg: "rgba(30, 30, 30, 1)",
  buttonBorder: "rgba(68, 68, 68, 1)",
  barTextColor: "rgba(255, 255, 255, 1)",
};

export const sharedParameters = {
  layout: "centered",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    codePanel: true,
  },

  darkMode: {
    classTarget: "html",
    stylePreview: true,
    dark: {
      ...themes.dark,
      ...darkTheme,
    },
    light: {
      ...themes.light,
      ...lightTheme,
    },
  },
} satisfies Preview["parameters"];
