import { Slot } from "@choiceform/slot"
import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react"
import { useAsRef } from "@choiceform/design-shared"
import { ITEM_DELETE_NAME } from "../constants"
import { useFileUploadItemContext, useStoreContext } from "../hooks"

export interface FileUploadItemDeleteProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

export const FileUploadItemDelete = forwardRef<HTMLButtonElement, FileUploadItemDeleteProps>(
  (props, forwardedRef) => {
    const { asChild, ...deleteProps } = props

    const store = useStoreContext(ITEM_DELETE_NAME)
    const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME)
    const propsRef = useAsRef(deleteProps)

    const onClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        propsRef.current?.onClick?.(event)

        if (!itemContext.fileState || event.defaultPrevented) return

        store.dispatch({
          variant: "REMOVE_FILE",
          file: itemContext.fileState.file,
        })
      },
      [store, itemContext.fileState, propsRef],
    )

    if (!itemContext.fileState) return null

    const ItemDeletePrimitive = asChild ? Slot : "button"

    return (
      <ItemDeletePrimitive
        type="button"
        aria-controls={itemContext.id}
        aria-describedby={itemContext.nameId}
        data-slot="file-upload-item-delete"
        {...deleteProps}
        ref={forwardedRef}
        onClick={onClick}
      />
    )
  },
)

FileUploadItemDelete.displayName = ITEM_DELETE_NAME
