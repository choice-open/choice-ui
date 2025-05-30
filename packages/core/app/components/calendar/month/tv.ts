import { tv } from "tailwind-variants"

export const MonthCalendarTv = tv({
  slots: {
    // 容器
    container: "bg-default-background rounded-md select-none",

    // 头部
    header: "grid items-center pt-2 pr-1 pl-3",
    headerWrapper: "flex h-6 items-center",
    title: "flex-1 truncate font-medium",

    // 星期标题区域
    weekdaysContainer: "text-secondary-foreground grid gap-0 px-2 text-center",
    weekday: "flex h-8 items-center justify-center text-sm",

    // 日期网格
    daysGrid: "grid gap-0 px-2 pb-2",

    // 日期单元格
    day: [
      "relative aspect-square w-full rounded-md",
      "flex items-center justify-center",
      "cursor-default select-none",
      "border border-transparent",
      "before:absolute before:z-0 before:content-['']",
      "after:absolute after:z-1 after:content-['']",
    ],

    // 日期数字
    dayNumber: "relative z-2",
    weekNumber: [
      "text-secondary-foreground aspect-square text-sm",
      "flex items-center justify-center",
    ],
    emptyDay: "",
  },

  variants: {
    // 是否在当前月
    inMonth: {
      true: { day: "" },
      false: { day: "text-disabled-foreground" },
    },

    showWeekNumbers: {
      true: {
        header: "grid-cols-8",
        daysGrid: "grid-cols-8",
        weekdaysContainer: "grid-cols-8",
        headerWrapper: "col-span-7",
      },
      false: {
        header: "grid-cols-7",
        daysGrid: "grid-cols-7",
        weekdaysContainer: "grid-cols-7",
        headerWrapper: "col-span-full",
      },
    },

    // 是否选中
    selected: {
      true: {
        day: "text-on-accent-foreground after:bg-accent-background after:inset-0.5 after:rounded-md",
      },
    },

    // 是否在选中范围内
    inRange: {
      true: {
        day: "before:bg-selected-background before:-inset-x-px before:inset-y-0.25",
      },
    },

    // 是否在悬停范围内（范围选择的预览）
    inHoverRange: {
      true: {
        day: "before:bg-secondary-background before:-inset-x-px before:inset-y-0.25",
      },
    },

    // 是否为范围内第一个
    isFirstInRange: {
      true: {},
    },

    // 是否为范围内最后一个
    isLastInRange: {
      true: {},
    },

    // 是否为悬停范围内第一个
    isFirstInHoverRange: {
      true: {},
    },

    // 是否为悬停范围内最后一个
    isLastInHoverRange: {
      true: {},
    },

    // 是否为范围内行首
    isFirstInRow: {
      true: {},
    },

    // 是否为范围内行尾
    isLastInRow: {
      true: {},
    },

    // 是否为今天
    today: {
      true: {
        day: "text-on-accent-foreground after:bg-danger-background after:inset-0.5 after:rounded-md",
      },
    },

    // 是否高亮
    highlighted: {
      true: {
        day: "after:border-selected-boundary after:inset-0.5 after:rounded-md after:border",
      },
    },

    // 是否禁用
    disabled: {
      true: { day: "text-disabled-foreground" },
      false: {},
    },

    // 是否显示当月外的日期
    showOutsideDays: {
      false: {},
    },
  },

  // 变体组合规则
  compoundVariants: [
    // 非当月且不显示外部日期
    {
      inMonth: false,
      showOutsideDays: false,
      className: { day: "invisible" },
    },
    {
      selected: true,
      today: false,
      className: {
        day: "text-on-accent-foreground after:bg-accent-background after:inset-0.5 after:rounded-md",
      },
    },
    {
      selected: true,
      today: true,
      className: {
        day: "after:ring-accent-background after:ring-offset-default-background after:ring-1 after:ring-offset-1",
      },
    },
    {
      disabled: false,
      inRange: false,
      inHoverRange: false,
      inMonth: true,
      className: {
        day: "hover:before:bg-secondary-background before:inset-0.25 before:rounded-md",
      },
    },
    {
      isFirstInRow: true,
      className: { day: "before:rounded-l-md" },
    },
    {
      isLastInRow: true,
      className: { day: "before:rounded-r-md" },
    },
    {
      isFirstInRange: true,
      isFirstInHoverRange: true,
      inHoverRange: true,
      className: { day: "before:rounded-l-md" },
    },
    {
      isLastInRange: true,
      isLastInHoverRange: true,
      inHoverRange: true,
      className: { day: "before:rounded-r-md" },
    },
    {
      isFirstInRange: true,
      inHoverRange: false,
      className: { day: "before:rounded-l-md" },
    },
    {
      isLastInRange: true,
      inHoverRange: false,
      className: { day: "before:rounded-r-md" },
    },
    {
      isFirstInHoverRange: true,
      className: { day: "before:rounded-l-md" },
    },
    {
      isLastInHoverRange: true,
      className: { day: "before:rounded-r-md" },
    },
  ],

  // 默认变体
  defaultVariants: {
    inMonth: true,
    showWeekNumbers: false,
    disabled: false,
    showOutsideDays: true,
    selected: false,
    today: false,
    highlighted: false,
    inRange: false,
    inHoverRange: false,
    isFirstInRange: false,
    isLastInRange: false,
  },
})
