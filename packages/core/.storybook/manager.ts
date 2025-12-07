import { addons } from "storybook/internal/manager-api"
import { defaultConfig, type TagBadgeParameters } from "storybook-addon-tag-badges"

const CSS_TO_HIDE_TEST_SECTION_FROM_SIDEBAR = `
  a[data-item-id*=-hidden-] {display: none !important}
`

const head = document.head || document.getElementsByTagName("head")[0]
const style = document.createElement("style")
head.appendChild(style)
style.appendChild(document.createTextNode(CSS_TO_HIDE_TEST_SECTION_FROM_SIDEBAR))

addons.setConfig({
  // isFullscreen: false,
  // showNav: true,
  // showPanel: true,
  // panelPosition: 'bottom',
  enableShortcuts: false,
  // showToolbar: true,
  // theme: undefined,
  // selectedPanel: undefined,
  // initialActive: 'sidebar',
  // sidebar: {
  //   showRoots: false,
  //   collapsedRoots: ['other'],
  // },
  // toolbar: {
  //   title: { hidden: false },
  //   zoom: { hidden: false },
  //   eject: { hidden: false },
  //   copy: { hidden: false },
  //   fullscreen: { hidden: false },
  // },

  tagBadges: [
    // Add an entry that matches 'frog' and displays a cool badge in the sidebar only
    {
      tags: "new",
      badge: {
        text: "New 🔆",
        style: {
          backgroundColor: "transparent",
          color: "rgba(13, 153, 255, 1)",
          borderColor: "transparent",
        },
        tooltip: "Recently added components or props/features",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    {
      tags: "beta",
      badge: {
        text: "Beta ⚡️",
        style: {
          backgroundColor: "transparent",
          color: "rgba(151, 71, 255, 1)",
          borderColor: "transparent",
        },
        tooltip: "Warn that a component or prop is not stable yet",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    {
      tags: "upgrade",
      badge: {
        text: "Upgrade ☘️",
        style: {
          backgroundColor: "transparent",
          color: "rgba(20, 174, 92, 1)",
          borderColor: "transparent",
        },
        tooltip:
          "Indicates that a component or feature has been significantly improved or changed, and users are encouraged to update to the latest version to benefit from new enhancements, optimizations, or important fixes. ",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    {
      tags: "experimental",
      badge: {
        text: "Experimental 🔬",
        style: {
          backgroundColor: "transparent",
          color: "rgba(255, 149, 0, 1)",
          borderColor: "transparent",
        },
        tooltip:
          "Indicates that a component or feature is experimental and may be unstable or subject to change. Use with caution and expect breaking changes. ",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    {
      tags: "code-only",
      badge: {
        text: "Code Only 💻",
        style: {
          backgroundColor: "transparent",
          color: "rgba(30, 174, 219, 1)",
          borderColor: "transparent",
        },
        tooltip: "Indicates that a component or feature is code only.",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    {
      tags: "deprecated",
      badge: {
        text: "Deprecated 🔴",
        style: {
          backgroundColor: "transparent",
          color: "rgba(242, 72, 34, 1)",
          borderColor: "transparent",
        },
        tooltip:
          "Indicates that a component or feature is deprecated and will be removed in the future.",
      },
      display: {
        sidebar: {
          skipInherited: true,
          type: "component",
        },
        toolbar: false,
      },
    },
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
})
