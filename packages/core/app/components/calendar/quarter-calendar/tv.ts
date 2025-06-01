import { tv } from "tailwind-variants"

export const QuarterCalendarTv = tv({
  slots: {
    // 容器
    container: "select-none",
    // 头部
    header: "flex items-center pt-2 pr-1 pl-3",
    title: "flex-1 truncate font-medium",
    navigation: "flex h-6 items-center",
    // 季度网格
    quartersGrid: "grid grid-cols-4 gap-0 px-2 pb-2",
    // 季度单元格
    quarterCell: [
      "relative w-full rounded-md py-2",
      "flex flex-col items-center justify-center",
      "cursor-default select-none",
      "border border-transparent",
      "before:absolute before:z-0 before:content-['']",
      "after:absolute after:z-1 after:content-['']",
    ],
    // 季度标题
    quarterTitle: "relative z-2 font-medium",
    // 月份列表
    monthsList: "relative z-2 mt-2",
    monthItem: "",
  },

  variants: {
    variant: {
      default: {
        container: "bg-default-background",
      },
      dark: {
        container: "bg-menu-background text-white",
      },
    },

    // 是否选中
    selected: {
      true: {},
    },

    // 是否为当前季度
    current: {
      true: {
        quarterCell:
          "text-on-accent-foreground after:bg-danger-background after:inset-0.5 after:rounded-md",
      },
    },

    // 是否在范围内
    inRange: {
      true: {},
      false: {},
    },

    // 是否禁用
    disabled: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      inRange: false,
      current: false,
      variant: "default",
      className: { quarterCell: "text-disabled-foreground" },
    },
    {
      inRange: false,
      current: false,
      variant: "dark",
      className: { quarterCell: "text-white/40" },
    },
    // Selected
    {
      selected: true,
      current: false,
      className: {
        quarterCell: "after:inset-0.25 after:rounded-md",
      },
    },
    {
      selected: true,
      current: false,
      variant: "default",
      className: {
        quarterCell: "after:bg-selected-background",
      },
    },
    {
      selected: true,
      current: false,
      variant: "dark",
      className: {
        quarterCell: "after:bg-gray-600",
      },
    },
    {
      selected: true,
      current: true,
      className: {
        quarterCell: "after:ring-accent-background",
      },
    },
    {
      selected: true,
      current: true,
      variant: "default",
      className: {
        quarterCell: "after:ring-offset-default-background after:ring-1 after:ring-offset-1",
      },
    },
    {
      selected: true,
      current: true,
      variant: "dark",
      className: {
        quarterCell: "after:ring-2 after:ring-gray-600",
      },
    },
    // Hover
    {
      disabled: false,
      className: {
        quarterCell: "before:inset-0.25 before:rounded-md",
      },
    },
    {
      disabled: false,
      variant: "default",
      className: {
        quarterCell: "hover:before:bg-secondary-background",
      },
    },
    {
      disabled: false,
      variant: "dark",
      className: {
        quarterCell: "hover:before:bg-gray-700",
      },
    },
    // Disabled
    {
      disabled: true,
      variant: "default",
      className: { quarterCell: "text-disabled-foreground" },
    },
    {
      disabled: true,
      variant: "dark",
      className: { quarterCell: "text-white/20" },
    },
  ],

  defaultVariants: {
    variant: "default",
  },
})

// 保持向后兼容
export const QuarterPickerTv = QuarterCalendarTv
