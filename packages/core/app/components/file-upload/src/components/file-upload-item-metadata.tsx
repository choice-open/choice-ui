import { ComponentPropsWithoutRef, forwardRef } from "react"
import { formatBytes, tcx } from "@choiceform/design-shared"
import { Slot } from "@choiceform/slot"
import { ITEM_METADATA_NAME } from "../constants"
import { useFileUploadContext, useFileUploadItemContext } from "../hooks"
import { fileUploadStyles } from "../tv"

export interface FileUploadItemMetadataProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export const FileUploadItemMetadata = forwardRef<HTMLDivElement, FileUploadItemMetadataProps>(
  (props, forwardedRef) => {
    const { asChild, children, className, ...metadataProps } = props

    const context = useFileUploadContext(ITEM_METADATA_NAME)
    const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME)
    const { itemMetadata, itemName, itemSize, itemError } = fileUploadStyles()

    if (!itemContext.fileState) return null

    const ItemMetadataPrimitive = asChild ? Slot : "div"

    return (
      <ItemMetadataPrimitive
        data-slot="file-upload-metadata"
        dir={context.dir}
        {...metadataProps}
        ref={forwardedRef}
        className={tcx(itemMetadata(), className)}
      >
        {children ?? (
          <>
            <span
              id={itemContext.nameId}
              className={itemName()}
            >
              {itemContext.fileState.file.name}
            </span>
            <span
              id={itemContext.sizeId}
              className={itemSize()}
            >
              {formatBytes(itemContext.fileState.file.size)}
            </span>
            {itemContext.fileState.error && (
              <span
                id={itemContext.messageId}
                className={itemError()}
              >
                {itemContext.fileState.error}
              </span>
            )}
          </>
        )}
      </ItemMetadataPrimitive>
    )
  },
)

FileUploadItemMetadata.displayName = ITEM_METADATA_NAME
