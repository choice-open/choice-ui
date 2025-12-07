import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { ComponentPropsWithoutRef, forwardRef, useId, useMemo } from "react"
import { ITEM_NAME } from "../constants"
import { FileUploadItemContext } from "../contexts"
import { useFileUploadContext, useStore } from "../hooks"
import { fileUploadStyles } from "../tv"

export interface FileUploadItemProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  value: File
}

export const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  (props, forwardedRef) => {
    const { value, asChild, className, ...itemProps } = props

    const id = useId()
    const statusId = `${id}-status`
    const nameId = `${id}-name`
    const sizeId = `${id}-size`
    const messageId = `${id}-message`

    const context = useFileUploadContext(ITEM_NAME)
    const fileState = useStore((state) => state.files.get(value))
    const fileCount = useStore((state) => state.files.size)
    const fileIndex = useStore((state) => {
      const files = Array.from(state.files.keys())
      return files.indexOf(value) + 1
    })

    const { item, statusText } = fileUploadStyles()

    const itemContext = useMemo(
      () => ({
        id,
        fileState,
        nameId,
        sizeId,
        statusId,
        messageId,
      }),
      [id, fileState, statusId, nameId, sizeId, messageId],
    )

    if (!fileState) return null

    const statusTextContent = fileState.error
      ? `Error: ${fileState.error}`
      : fileState.status === "uploading"
        ? `Uploading: ${fileState.progress}% complete`
        : fileState.status === "success"
          ? "Upload complete"
          : "Ready to upload"

    const ItemPrimitive = asChild ? Slot : "div"

    return (
      <FileUploadItemContext.Provider value={itemContext}>
        <ItemPrimitive
          role="listitem"
          id={id}
          aria-setsize={fileCount}
          aria-posinset={fileIndex}
          aria-describedby={`${nameId} ${sizeId} ${statusId} ${fileState.error ? messageId : ""}`}
          aria-labelledby={nameId}
          data-slot="file-upload-item"
          dir={context.dir}
          {...itemProps}
          ref={forwardedRef}
          className={tcx(item(), className)}
        >
          {props.children}
          <span
            id={statusId}
            className={statusText()}
          >
            {statusTextContent}
          </span>
        </ItemPrimitive>
      </FileUploadItemContext.Provider>
    )
  },
)

FileUploadItem.displayName = ITEM_NAME
