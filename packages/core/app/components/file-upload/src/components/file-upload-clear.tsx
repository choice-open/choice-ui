import { Slot } from "@choiceform/slot"
import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react"
import { useAsRef } from "@choiceform/design-shared"
import { CLEAR_NAME } from "../constants"
import { useFileUploadContext, useStore, useStoreContext } from "../hooks"

export interface FileUploadClearProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
  forceMount?: boolean
}

export const FileUploadClear = forwardRef<HTMLButtonElement, FileUploadClearProps>(
  (props, forwardedRef) => {
    const { asChild, forceMount, disabled, ...clearProps } = props

    const context = useFileUploadContext(CLEAR_NAME)
    const store = useStoreContext(CLEAR_NAME)
    const propsRef = useAsRef(clearProps)

    const isDisabled = disabled || context.disabled

    const onClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        propsRef.current?.onClick?.(event)

        if (event.defaultPrevented) return

        store.dispatch({ variant: "CLEAR" })
      },
      [store, propsRef],
    )

    const filesCount = useStore((state) => state.files.size)
    const shouldRender = forceMount || filesCount > 0

    if (!shouldRender) return null

    const ClearPrimitive = asChild ? Slot : "button"

    return (
      <ClearPrimitive
        type="button"
        aria-controls={context.listId}
        data-slot="file-upload-clear"
        data-disabled={isDisabled ? "" : undefined}
        {...clearProps}
        ref={forwardedRef}
        disabled={isDisabled}
        onClick={onClick}
      />
    )
  },
)

FileUploadClear.displayName = CLEAR_NAME
