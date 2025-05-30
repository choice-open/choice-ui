import { tv } from "tailwind-variants"

export const YearPickerTv = tv({
  slots: {
    // 容器
    container: "bg-default-background rounded-md select-none",

    // 头部
    header: "flex items-center justify-between p-3",
    title: "text-lg font-medium",
    navigation: "flex items-center gap-1",
    navButton: [
      "h-8 w-8 rounded-md",
      "flex items-center justify-center",
      "hover:bg-default-100",
      "focus:bg-default-100",
      "transition-colors",
      "cursor-pointer",
    ],

    // 年份网格
    yearsGrid: "grid grid-cols-3 gap-1 p-3",

    // 年份单元格
    yearCell: [
      "relative aspect-square w-full rounded-md",
      "flex items-center justify-center",
      "cursor-pointer select-none",
      "border border-transparent",
      "transition-all duration-200",
      "hover:bg-default-100",
      "focus:ring-primary-500 focus:ring-2 focus:ring-offset-1 focus:outline-none",
    ],

    // 年份数字
    yearText: "text-sm font-medium",
  },

  variants: {
    // 是否选中
    selected: {
      true: {
        yearCell: ["bg-primary-500 text-primary-foreground", "hover:bg-primary-600"],
      },
    },

    // 是否为当前年份
    current: {
      true: {
        yearCell: "border-primary-500 border-2",
      },
    },

    // 是否禁用
    disabled: {
      true: {
        yearCell: ["text-disabled-foreground cursor-not-allowed", "hover:bg-transparent"],
      },
    },

    // 是否在范围内
    inRange: {
      true: { yearCell: "" },
      false: {
        yearCell: "text-disabled-foreground opacity-40",
        yearText: "text-disabled-foreground",
      },
    },
  },

  compoundVariants: [
    {
      selected: true,
      current: true,
      class: {
        yearCell: "border-primary-foreground",
      },
    },
    {
      disabled: true,
      selected: true,
      class: {
        yearCell: "bg-disabled-background text-disabled-foreground",
      },
    },
  ],

  defaultVariants: {
    inRange: true,
  },
})
