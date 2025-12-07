import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useCallback } from "react"
import { ITEM_PREVIEW_NAME } from "../constants"
import { useFileUploadItemContext } from "../hooks"
import { fileUploadStyles } from "../tv"
import { getFileIcon } from "../utils"

export interface FileUploadItemPreviewProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  render?: (file: File) => ReactNode
}

export const FileUploadItemPreview = forwardRef<HTMLDivElement, FileUploadItemPreviewProps>(
  (props, forwardedRef) => {
    const { render, asChild, children, className, ...previewProps } = props

    const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME)
    const { itemPreview, itemPreviewImage, itemPreviewIcon } = fileUploadStyles()

    const isImage = itemContext.fileState?.file.type.startsWith("image/")

    const onPreviewRender = useCallback(
      (file: File) => {
        if (render) return render(file)

        if (isImage) {
          return (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className={tcx("size-full rounded object-cover", itemPreviewImage())}
              onLoad={(event) => {
                if (!(event.target instanceof HTMLImageElement)) return
                URL.revokeObjectURL(event.target.src)
              }}
            />
          )
        }

        return getFileIcon(file)
      },
      [isImage, render, itemPreviewImage],
    )

    if (!itemContext.fileState) return null

    const ItemPreviewPrimitive = asChild ? Slot : "div"

    return (
      <ItemPreviewPrimitive
        aria-labelledby={itemContext.nameId}
        data-slot="file-upload-preview"
        {...previewProps}
        ref={forwardedRef}
        className={tcx(itemPreview(), isImage ? itemPreviewImage() : itemPreviewIcon(), className)}
      >
        {onPreviewRender(itemContext.fileState.file)}
        {children}
      </ItemPreviewPrimitive>
    )
  },
)

FileUploadItemPreview.displayName = ITEM_PREVIEW_NAME
