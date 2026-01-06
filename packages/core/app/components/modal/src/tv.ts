import { tcv } from "@choice-ui/shared"

export const ModalTv = tcv({
  slots: {
    root: "bg-default-background z-modals pointer-events-auto relative flex max-w-fit flex-col rounded-xl shadow-xl",
  },
})

export const ModalHeaderTv = tcv({
  slots: {
    root: ["modal__header", "grid border-default-boundary w-full flex-none items-center border-b"],
    title:
      "text-body-medium flex min-w-0 items-center gap-2 p-2 font-strong [grid-area:title] select-none",
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
        root: "grid-cols-[auto_1fr_2.5rem]",
      },
      false: {},
    },
  },
  defaultVariants: {
    validElement: false,
    close: true,
  },
})

export const ModalContentTv = tcv({
  slots: {
    root: "flex-1",
  },
})

export const ModalFooterTv = tcv({
  slots: {
    root: "border-default-boundary flex h-10 flex-none items-center justify-between gap-2 border-t p-2",
  },
})

export const ModalBackdropTv = tcv({
  base: "z-modals fixed inset-0 grid place-items-center bg-black/20",
})
