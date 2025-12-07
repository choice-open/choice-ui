import { tcv } from "@choiceform/design-shared"

export const MonthCalendarTv = tcv({
  slots: {
    // 容器
    container: "select-none",

    // 头部
    header: "grid items-center pt-2 pr-1 pl-3",
    headerWrapper: "flex h-6 items-center",
    title: "flex-1 truncate font-strong",

    // 星期标题区域
    weekdaysContainer: "grid gap-0 px-2 text-center",
    weekday: "flex h-8 items-center justify-center text-body-small",

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
    weekNumber: "flex aspect-square items-center justify-center text-body-small",
    emptyDay: "",
  },

  variants: {
    // 是否在当前月
    inMonth: {
      false: {},
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
      true: {},
    },

    // 是否在选中范围内
    inRange: {
      true: {
        day: "before:-inset-x-px before:inset-y-0.25",
      },
    },

    // 是否在悬停范围内（范围选择的预览）
    inHoverRange: {
      true: {
        day: "before:-inset-x-px before:inset-y-0.25",
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
      true: {},
      false: {},
    },

    // 是否显示当月外的日期
    showOutsideDays: {
      false: {},
    },

    selectionMode: {
      single: {},
      multiple: {},
      range: {},
    },

    variant: {
      default: {
        container: "bg-default-background",
        weekdaysContainer: "text-secondary-foreground",
        weekNumber: "text-secondary-foreground",
      },
      dark: {
        container: "bg-menu-background text-white",
        weekdaysContainer: "text-white/40",
        weekNumber: "text-white/40",
      },
    },
  },

  compoundVariants: [
    {
      inMonth: false,
      today: false,
      variant: "default",
      className: { day: "text-disabled-foreground" },
    },
    {
      inMonth: false,
      today: false,
      variant: "dark",
      className: { day: "text-white/40" },
    },
    {
      inMonth: false,
      showOutsideDays: false,
      className: { day: "invisible" },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: false,
      className: {
        day: "after:inset-0 after:rounded-md",
      },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: false,
      variant: "default",
      className: {
        day: "after:bg-selected-background",
      },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: false,
      variant: "dark",
      className: {
        day: "after:bg-gray-600",
      },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: true,
      className: {
        day: "after:ring-accent-background",
      },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: true,
      variant: "default",
      className: {
        day: "after:ring-offset-default-background after:ring-1 after:ring-offset-1",
      },
    },
    {
      selectionMode: ["single", "multiple"],
      selected: true,
      today: true,
      variant: "dark",
      className: {
        day: "after:ring-2 after:ring-gray-600",
      },
    },
    // Hover
    {
      disabled: false,
      inRange: false,
      inHoverRange: false,
      className: {
        day: "before:inset-0 before:rounded-md",
      },
    },
    {
      disabled: false,
      inRange: false,
      inHoverRange: false,
      variant: "default",
      className: {
        day: "hover:before:bg-secondary-background",
      },
    },
    {
      disabled: false,
      inRange: false,
      inHoverRange: false,
      variant: "dark",
      className: {
        day: "hover:before:bg-gray-700",
      },
    },
    {
      inHoverRange: true,
      variant: "default",
      className: {
        day: "before:bg-secondary-background",
      },
    },
    {
      inRange: true,
      inHoverRange: false,
      variant: "default",
      className: {
        day: "before:bg-selected-background",
      },
    },
    {
      inHoverRange: true,
      variant: "dark",
      className: {
        day: "before:bg-gray-600",
      },
    },
    {
      inRange: true,
      inHoverRange: false,
      variant: "dark",
      className: {
        day: "before:bg-accent-background/20",
      },
    },
    // Rounded
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
    // Disabled
    {
      disabled: true,
      variant: "default",
      className: { day: "text-disabled-foreground" },
    },
    {
      disabled: true,
      variant: "dark",
      className: { day: "text-white/20" },
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
    selectionMode: "single",
    variant: "default",
  },
})
