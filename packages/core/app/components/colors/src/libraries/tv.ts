import { tcv } from "@choice-ui/shared"

export const colorLibrariesItemTv = tcv({
  slots: {
    container: "group flex items-center select-none",
    wrapper: "flex w-full min-w-0 flex-1 items-center gap-x-2",
    palette: "aspect-square",
    itemIcon: "flex size-4 flex-none items-center justify-center",
    variableName: "max-w-9/10 shrink-0 grow truncate",
    variableValue: "text-secondary-foreground min-w-0 truncate pr-2",
    styleName: "truncate",
    styleValue: "text-secondary-foreground min-w-0 shrink-0 truncate pr-2",
    itemSetup: "hidden group-hover:flex",
  },
  variants: {
    displayType: {
      LIST: {
        container: "h-8 w-full min-w-0 gap-2 pr-3 pl-5",
      },
      LARGE_GRID: {
        container: "p-1",
      },
      SMALL_GRID: {
        container: "cursor-(--color-picker-cursor) justify-center p-1",
        palette: "rounded-sm",
      },
    },
    isDuplicate: {
      true: {
        palette: "ring-warning ring-2 ring-offset-2",
      },
      false: {},
    },
    libraryType: {
      STYLE: {},
      VARIABLE: {},
    },
    isSelected: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      displayType: "LIST",
      isSelected: true,
      class: {
        container: "bg-selected-background",
      },
    },
    {
      displayType: "LIST",
      isSelected: false,
      class: {
        container: "hover:bg-secondary-background",
      },
    },
    {
      displayType: "LARGE_GRID",
      libraryType: "STYLE",
      class: {
        palette: "rounded-full",
      },
    },
    {
      displayType: "LARGE_GRID",
      libraryType: "VARIABLE",
      class: {
        palette: "rounded-md",
      },
    },
    {
      displayType: "LARGE_GRID",
      isSelected: true,
      class: {
        palette: "ring-selected-boundary ring-2 ring-offset-2",
      },
    },
    {
      displayType: "LARGE_GRID",
      isSelected: false,
      class: {
        palette: "hover:ring-2 hover:ring-(--color)",
      },
    },
    {
      displayType: "LIST",
      libraryType: "STYLE",
      class: {
        palette: "rounded-full",
      },
    },
    {
      displayType: "LIST",
      libraryType: "VARIABLE",
      class: {
        palette: "rounded-sm",
      },
    },
  ],
})

export const colorLibrariesHeaderTv = tcv({
  slots: {
    container: "flex flex-col",
    selections: "flex items-center gap-4",
  },
  variants: {
    isLibrariesPane: {
      true: {
        container: "border-b",
        selections: "justify-between py-2 pr-2 pl-4",
      },
      false: {
        container: "border-t",
        selections: "px-4 pt-3 pb-2",
      },
    },
  },
})

export const colorLibrariesPaneTv = tcv({
  slots: {
    container: "absolute top-0 left-0 grid w-full",
  },
  variants: {
    displayType: {
      LIST: {
        container: "p-1",
      },
      LARGE_GRID: {
        container: "p-0",
      },
      SMALL_GRID: {
        container: "p-0",
      },
    },
  },
})
