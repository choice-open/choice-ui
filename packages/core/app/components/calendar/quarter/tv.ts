import { tv } from "tailwind-variants"

export const QuarterPickerTv = tv({
  slots: {
    // 容器
    container: "bg-default-background rounded-md select-none",

    // 头部
    header: "border-default-200 flex items-center justify-between border-b p-3",
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

    // 季度网格
    quartersGrid: "grid grid-cols-2 gap-3 p-4",

    // 季度单元格
    quarterCell: [
      "border-default-200 rounded-lg border p-4",
      "cursor-pointer select-none",
      "transition-all duration-200",
      "hover:border-primary-300 hover:bg-primary-50",
      "focus:ring-primary-500 focus:ring-2 focus:ring-offset-1 focus:outline-none",
    ],

    // 季度标题
    quarterTitle: "mb-2 text-sm font-medium",

    // 月份列表
    monthsList: "space-y-1",
    monthItem: "text-secondary-foreground text-xs",
  },

  variants: {
    // 是否选中
    selected: {
      true: {
        quarterCell: [
          "bg-primary-500 text-primary-foreground border-primary-500",
          "hover:bg-primary-600 hover:border-primary-600",
        ],
        quarterTitle: "text-primary-foreground",
        monthItem: "text-primary-foreground/80",
      },
    },

    // 是否为当前季度
    current: {
      true: {
        quarterCell: "border-primary-500 border-2",
      },
    },

    // 是否禁用
    disabled: {
      true: {
        quarterCell: [
          "text-disabled-foreground border-disabled-border cursor-not-allowed",
          "hover:border-disabled-border hover:bg-transparent",
        ],
        quarterTitle: "text-disabled-foreground",
        monthItem: "text-disabled-foreground",
      },
    },
  },

  compoundVariants: [
    {
      selected: true,
      current: true,
      class: {
        quarterCell: "border-primary-foreground border-2",
      },
    },
    {
      disabled: true,
      selected: true,
      class: {
        quarterCell: "bg-disabled-background text-disabled-foreground border-disabled-border",
        quarterTitle: "text-disabled-foreground",
        monthItem: "text-disabled-foreground",
      },
    },
  ],
})
