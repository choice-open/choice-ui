import { tv } from "tailwind-variants"

export const YearCalendarTv = tv({
  slots: {
    // 容器
    container: "select-none",

    // 头部
    header: "flex items-center pt-2 pr-1 pl-3",
    title: "flex-1 truncate font-medium",
    navigation: "flex h-6 items-center",

    // 年份网格
    yearsGrid: "grid grid-cols-3 gap-0 px-2 pb-2",

    // 年份单元格
    yearCell: [
      "relative h-6 w-full rounded-md",
      "flex items-center justify-center",
      "cursor-default select-none",
      "border border-transparent",
      "before:absolute before:z-0 before:content-['']",
      "after:absolute after:z-1 after:content-['']",
    ],

    // 年份数字
    yearText: "relative z-2",
  },

  variants: {
    // 是否选中
    selected: {
      true: {},
    },

    // 是否为当前年份
    current: {
      true: {
        yearCell:
          "text-on-accent-foreground after:bg-danger-background after:inset-0.5 after:rounded-md",
      },
    },

    // 是否禁用
    disabled: {
      true: {},
    },

    // 是否在范围内
    inRange: {
      true: {},
      false: {},
    },
    variant: {
      default: {
        container: "bg-default-background",
      },
      dark: {
        container: "bg-menu-background text-white",
      },
    },
  },

  compoundVariants: [
    {
      inRange: false,
      current: false,
      variant: "default",
      className: { yearCell: "text-disabled-foreground" },
    },
    {
      inRange: false,
      current: false,
      variant: "dark",
      className: { yearCell: "text-white/40" },
    },
    // Selected
    {
      selected: true,
      current: false,
      className: {
        yearCell: "after:inset-0 after:rounded-md",
      },
    },
    {
      selected: true,
      current: false,
      variant: "default",
      className: {
        yearCell: "after:bg-selected-background",
      },
    },
    {
      selected: true,
      current: false,
      variant: "dark",
      className: {
        yearCell: "after:bg-gray-600",
      },
    },
    {
      selected: true,
      current: true,
      className: {
        yearCell: "after:ring-accent-background",
      },
    },
    {
      selected: true,
      current: true,
      variant: "default",
      className: {
        yearCell: "after:ring-offset-default-background after:ring-1 after:ring-offset-1",
      },
    },
    {
      selected: true,
      current: true,
      variant: "dark",
      className: {
        yearCell: "after:ring-2 after:ring-gray-600",
      },
    },
    // Hover
    {
      disabled: false,
      className: {
        yearCell: "before:inset-0 before:rounded-md",
      },
    },
    {
      disabled: false,
      variant: "default",
      className: {
        yearCell: "hover:before:bg-secondary-background",
      },
    },
    {
      disabled: false,
      variant: "dark",
      className: {
        yearCell: "hover:before:bg-gray-700",
      },
    },
    // Disabled
    {
      disabled: true,
      variant: "default",
      className: { yearCell: "text-disabled-foreground" },
    },
    {
      disabled: true,
      variant: "dark",
      className: { yearCell: "text-white/20" },
    },
  ],

  defaultVariants: {
    variant: "default",
  },
})
