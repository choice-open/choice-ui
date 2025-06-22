import { tv } from "tailwind-variants"

export const emojiTv = tv({
  slots: {
    container: "flex flex-col overflow-hidden",
    header: "flex flex-col gap-2 border-b p-2",
    categoriesContainer: "flex gap-1 overflow-x-auto p-2",
    scroll: "h-(--emoji-height) flex-none",
    content: "relative flex min-h-full w-full flex-col",
    row: "absolute top-0 left-0 box-border grid grid-cols-[repeat(var(--emoji-columns),1fr)] items-center px-(--emoji-padding)",
    categoryHeader: "absolute top-0 left-0 flex w-full items-center px-3 font-medium",
  },
  variants: {
    variant: {
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
        container: "bg-white",
        header: "border-default-boundary",
        categoryHeader: "text-secondary-foreground",
        footer: "border-default-boundary",
        emojiPreviewEmpty: "border-default-boundary",
        emojiName: "text-foreground",
        emojiCode: "text-secondary-foreground",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

export const emojiItemTv = tv({
  base: "flex size-8 items-center justify-center rounded-md border border-transparent text-xl",
  variants: {
    variant: {
      dark: {},
      light: {},
    },
    selected: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "dark",
      selected: true,
      class: "border-white/20 bg-white/10",
    },
    {
      variant: "dark",
      selected: false,
      class: "hover:bg-white/10",
    },
    {
      variant: "light",
      selected: true,
      class: "border-selected-boundary bg-selected-background",
    },
    {
      variant: "light",
      selected: false,
      class: "hover:bg-secondary-background",
    },
  ],
  defaultVariants: {
    variant: "dark",
    selected: false,
  },
})

export const emojiFooterTv = tv({
  slots: {
    footer: "flex flex-shrink-0 items-center gap-2 border-t px-3 py-2",
    emojiPreview: "flex size-8 items-center justify-center text-2xl",
    emojiPreviewEmpty: "flex size-6 rounded-full border border-dashed",
    emojiInfo: "flex flex-col gap-0",
    emojiName: "leading-tight font-medium",
    emojiCode: "text-sm leading-tight opacity-60",
  },
  variants: {
    variant: {
      dark: {
        footer: "border-menu-boundary",
        emojiPreviewEmpty: "border-white/20",
        emojiName: "text-white",
        emojiCode: "text-white/60",
      },
      light: {
        footer: "border-default-boundary",
        emojiPreviewEmpty: "border-default-boundary",
        emojiName: "text-foreground",
        emojiCode: "text-secondary-foreground",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

export const emojiEmptyTv = tv({
  slots: {
    container: "flex h-32 flex-col items-center justify-center p-4 text-center",
    title: "text-2xl font-medium",
    description: "mt-2 w-32",
  },
  variants: {
    variant: {
      dark: {
        title: "text-white",
        description: "text-white/50",
      },
      light: {
        title: "text-default-foreground",
        description: "text-secondary-foreground",
      },
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})
