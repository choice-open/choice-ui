import { tcv } from "~/utils"

export const skeletonTv = tcv({
  slots: {
    root: [
      "block",
      "bg-secondary-background",
      "relative",
      "overflow-hidden",
      "will-change-opacity",
    ],
    wave: [
      "absolute",
      "inset-0",
      "bg-gradient-to-r",
      "from-transparent",
      "via-white/10",
      "to-transparent",
      "-translate-x-full",
      "animate-skeleton-wave",
    ],
  },
  variants: {
    variant: {
      text: {
        root: [
          "h-4", // 添加默认高度
          "my-0",
          "scale-y-[0.6]",
          "origin-[0_55%]",
          "rounded-[0.125rem]",
          "empty:before:content-['\\00a0']",
          "empty:before:inline-block",
        ],
      },
      rectangular: {
        root: "rounded-none",
      },
      rounded: {
        root: "rounded-md",
      },
      circular: {
        root: "rounded-full",
      },
    },
    animation: {
      pulse: {
        root: "animate-skeleton-pulse",
      },
      wave: {
        root: "bg-secondary-background",
      },
      false: {},
    },
    hasChildren: {
      true: {
        root: "[&>*]:invisible",
      },
      false: {},
    },
    fitContent: {
      true: {
        root: "max-w-fit",
      },
      false: {},
    },
    heightAuto: {
      true: {
        root: "!h-auto", // 使用 !important 覆盖默认高度
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "text",
      hasChildren: false,
      class: {
        root: "block w-full",
      },
    },
    {
      variant: "text",
      hasChildren: true,
      class: {
        root: "inline-block",
      },
    },
  ],
  defaultVariants: {
    variant: "text",
    animation: "pulse",
    hasChildren: false,
    fitContent: false,
    heightAuto: false,
  },
})
