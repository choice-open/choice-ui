import { tv } from "tailwind-variants"

export const fileUploadStyles = tv({
  slots: {
    root: "relative flex flex-col gap-2",
    dropzone: [
      "hover:bg-secondary-background focus-visible:border-ring/50",
      "data-[dragging]:border-selected-boundary data-[invalid]:border-danger-foreground",
      "data-[invalid]:ring-danger-foreground/20",
      "relative flex flex-col items-center justify-center gap-2",
      "rounded-xl border border-dashed p-8",
      "outline-none select-none data-[disabled]:pointer-events-none",
    ],
    trigger: "",
    list: [
      "data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0",
      "data-[state=inactive]:slide-out-to-top-2 data-[state=active]:slide-in-from-top-2",
      "data-[state=active]:animate-in data-[state=inactive]:animate-out",
      "flex flex-col gap-2",
    ],
    item: [
      "relative flex items-center gap-2 rounded-lg border p-2",
      "has-[_[data-slot=file-upload-progress]]:flex-col",
      "has-[_[data-slot=file-upload-progress]]:items-start",
    ],
    itemPreview: "relative flex size-10 shrink-0 items-center justify-center rounded-md",
    itemPreviewImage: "object-cover",
    itemPreviewIcon: "bg-secondary-background",
    itemMetadata: "flex min-w-0 flex-1 flex-col",
    itemName: "truncate font-medium",
    itemSize: "text-secondary-foreground",
    itemError: "text-danger-foreground",
    itemProgress: "bg-secondary-background relative h-1 w-full overflow-hidden rounded-full",
    itemProgressBar: "bg-accent-foreground h-full w-full flex-1 transition-all",
    itemProgressCircular: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    itemDelete: "",
    clear: "",
    input: "sr-only",
    label: "sr-only",
    statusText: "sr-only",
  },
  variants: {
    orientation: {
      horizontal: {
        list: "flex-row overflow-x-auto p-1.5",
      },
      vertical: {
        list: "flex-col",
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})
