import { tv } from "tailwind-variants"

export const ModalTv = tv({
  slots: {
    root: "bg-default-background z-modals pointer-events-auto relative flex max-w-fit flex-col rounded-xl shadow-xl",
  },
})

export const ModalHeaderTv = tv({
  slots: {
    root: "modal__header border-default-boundary w-full flex-none items-center border-b",
    title:
      "leading-md tracking-md flex min-w-0 items-center gap-2 p-2 font-medium [grid-area:title]",
    close: "p-2 [grid-area:close]",
  },
  variants: {
    validElement: {
      true: {
        title: "",
      },
      false: {
        title: "ml-2",
      },
    },
    close: {
      true: {
        root: "modal__header--action",
      },
      false: {},
    },
  },
  defaultVariants: {
    validElement: false,
    close: true,
  },
})

export const ModalContentTv = tv({
  slots: {
    root: "flex-1",
  },
})

export const ModalFooterTv = tv({
  slots: {
    root: "border-default-boundary flex h-10 flex-none items-center justify-between gap-2 border-t p-2",
  },
})

export const ModalBackdropTv = tv({
  base: "z-modals fixed inset-0 grid place-items-center bg-black/20",
})
