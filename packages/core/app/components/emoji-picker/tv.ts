import { tcv } from "~/utils"

export const emojiTv = tcv({
  slots: {
    container: "flex flex-col overflow-hidden",
    header: "flex flex-col gap-2 border-b p-2",
    categoriesContainer: "flex gap-1 overflow-x-auto p-2",
    scroll: "h-(--emoji-height) flex-none",
    content: "relative flex min-h-full w-full flex-col",
    row: "absolute top-0 left-0 box-border grid grid-cols-[repeat(var(--emoji-columns),1fr)] items-center px-(--emoji-padding)",
    categoryHeader: "absolute top-0 left-0 flex w-full items-center px-3 font-strong",
  },
  variants: {
    variant: {
      default: {
        container: "bg-default-background text-default-foreground",
        header: "border-default-boundary text-default-foreground",
        categoryHeader: "text-secondary-foreground",
        footer: "border-default-boundary",
        emojiPreviewEmpty: "border-default-boundary",
        emojiName: "text-default-foreground",
        emojiCode: "text-secondary-foreground",
      },
      dark: {
        container: "bg-menu-background text-white",
        header: "border-menu-boundary text-default-foreground",
        categoryHeader: "text-white/50",
        footer: "border-menu-boundary",
        emojiPreviewEmpty: "border-white/20",
        emojiName: "text-white",
        emojiCode: "text-white/60",
      },
      light: {
        container: "bg-white text-gray-900",
        header: "border-gray-200",
        categoryHeader: "text-gray-500",
        footer: "border-gray-200",
        emojiPreviewEmpty: "border-gray-200",
        emojiName: "text-foreground",
        emojiCode: "text-secondary-foreground",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

export const emojiItemTv = tcv({
  base: "flex size-8 items-center justify-center rounded-md border border-transparent text-[1.25rem]",
  variants: {
    variant: {
      default: {},
      light: {},
      dark: {},
    },
    selected: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "default",
      selected: true,
      class: "bg-selected-background",
    },
    {
      variant: "default",
      selected: false,
      class: "hover:bg-secondary-background",
    },

    {
      variant: "light",
      selected: true,
      class: "bg-blue-200",
    },
    {
      variant: "light",
      selected: false,
      class: "hover:bg-black/10",
    },

    {
      variant: "dark",
      selected: true,
      class: "bg-blue-pale-700",
    },
    {
      variant: "dark",
      selected: false,
      class: "hover:bg-white/10",
    },
  ],
  defaultVariants: {
    variant: "dark",
    selected: false,
  },
})

export const emojiFooterTv = tcv({
  slots: {
    footer: "flex flex-shrink-0 items-center gap-2 border-t px-3 py-2",
    emojiPreview: "flex size-8 items-center justify-center text-xl",
    emojiPreviewEmpty: "flex size-6 rounded-full border border-dashed",
    emojiInfo: "flex flex-col gap-0",
    emojiName: "leading-tight font-strong",
    emojiCode: "text-body-small leading-tight",
  },
  variants: {
    variant: {
      default: {
        footer: "border-default-boundary",
        emojiPreviewEmpty: "border-default-boundary",
        emojiName: "text-default-foreground",
        emojiCode: "text-secondary-foreground",
      },
      light: {
        footer: "border-gray-200",
        emojiPreviewEmpty: "border-gray-200",
        emojiName: "text-gray-900",
        emojiCode: "text-black/50",
      },
      dark: {
        footer: "border-menu-boundary",
        emojiPreviewEmpty: "border-white/20",
        emojiName: "text-white",
        emojiCode: "text-white/50",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

export const emojiEmptyTv = tcv({
  slots: {
    container: "flex h-32 flex-col items-center justify-center p-4 text-center",
    title: "text-heading-display",
    description: "mt-2 w-32",
  },
  variants: {
    variant: {
      default: {
        title: "text-default-foreground",
        description: "text-secondary-foreground",
      },

      light: {
        title: "text-gray-900",
        description: "text-black/50",
      },

      dark: {
        title: "text-white",
        description: "text-white/50",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})
