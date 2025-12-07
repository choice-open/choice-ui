import { tcx } from "@choiceform/design-shared"
import { Slot } from "@choiceform/slot"
import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react"
import { useAsRef } from "@choiceform/design-shared"
import { DROPZONE_NAME } from "../constants"
import { useFileUploadContext, useStore, useStoreContext } from "../hooks"
import { fileUploadStyles } from "../tv"

export interface FileUploadDropzoneProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  (props, forwardedRef) => {
    const { asChild, className, ...dropzoneProps } = props

    const context = useFileUploadContext(DROPZONE_NAME)
    const store = useStoreContext(DROPZONE_NAME)
    const dragOver = useStore((state) => state.dragOver)
    const invalid = useStore((state) => state.invalid)
    const propsRef = useAsRef(dropzoneProps)

    const { dropzone } = fileUploadStyles()

    const onClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        propsRef.current?.onClick?.(event)

        if (event.defaultPrevented) return

        const target = event.target

        const isFromTrigger =
          target instanceof HTMLElement && target.closest('[data-slot="file-upload-trigger"]')

        if (!isFromTrigger) {
          context.inputRef.current?.click()
        }
      },
      [context.inputRef, propsRef],
    )

    const onDragOver = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragOver?.(event)

        if (event.defaultPrevented) return

        event.preventDefault()
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: true })
      },
      [store, propsRef],
    )

    const onDragEnter = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragEnter?.(event)

        if (event.defaultPrevented) return

        event.preventDefault()
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: true })
      },
      [store, propsRef],
    )

    const onDragLeave = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDragLeave?.(event)

        if (event.defaultPrevented) return

        event.preventDefault()
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: false })
      },
      [store, propsRef],
    )

    const onDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        propsRef.current?.onDrop?.(event)

        if (event.defaultPrevented) return

        event.preventDefault()
        store.dispatch({ variant: "SET_DRAG_OVER", dragOver: false })

        const files = Array.from(event.dataTransfer.files)
        const inputElement = context.inputRef.current
        if (!inputElement) return

        const dataTransfer = new DataTransfer()
        for (const file of files) {
          dataTransfer.items.add(file)
        }

        inputElement.files = dataTransfer.files
        inputElement.dispatchEvent(new Event("change", { bubbles: true }))
      },
      [store, context.inputRef, propsRef],
    )

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        propsRef.current?.onKeyDown?.(event)

        if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          context.inputRef.current?.click()
        }
      },
      [context.inputRef, propsRef],
    )

    const DropzonePrimitive = asChild ? Slot : "div"

    return (
      <DropzonePrimitive
        role="region"
        id={context.dropzoneId}
        aria-controls={`${context.inputId} ${context.listId}`}
        aria-disabled={context.disabled}
        aria-invalid={invalid}
        data-disabled={context.disabled ? "" : undefined}
        data-dragging={dragOver ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        data-slot="file-upload-dropzone"
        dir={context.dir}
        {...dropzoneProps}
        ref={forwardedRef}
        tabIndex={context.disabled ? undefined : 0}
        className={tcx(dropzone(), className)}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onKeyDown={onKeyDown}
      />
    )
  },
)

FileUploadDropzone.displayName = DROPZONE_NAME
