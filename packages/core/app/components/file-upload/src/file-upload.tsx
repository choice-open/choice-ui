import { Slot } from "@choiceform/slot"
import { tcx } from "@choiceform/design-shared"
import { ChangeEvent, forwardRef, useCallback, useEffect, useId, useMemo, useRef } from "react"
import { DirectionContext, useAsRef, useDirection, useLazyRef } from "@choiceform/design-shared"
import {
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./components"
import { ROOT_NAME } from "./constants"
import { FileUploadContext, StoreContext } from "./contexts"
import { useStore } from "./hooks"
import { createStore } from "./store"
import { fileUploadStyles } from "./tv"
import { Direction, FileState } from "./types"

interface FileUploadRootProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  accept?: string
  asChild?: boolean
  defaultValue?: File[]
  dir?: Direction
  disabled?: boolean
  invalid?: boolean
  label?: string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  name?: string
  onAccept?: (files: File[]) => void
  onFileAccept?: (file: File) => void
  onFileReject?: (file: File, message: string) => void
  onFileValidate?: (file: File) => string | null | undefined
  onUpload?: (
    files: File[],
    options: {
      onError: (file: File, error: Error) => void
      onProgress: (file: File, progress: number) => void
      onSuccess: (file: File) => void
    },
  ) => Promise<void> | void
  onValueChange?: (files: File[]) => void
  required?: boolean
  value?: File[]
}

const FileUploadRoot = forwardRef<HTMLDivElement, FileUploadRootProps>((props, forwardedRef) => {
  const {
    value,
    defaultValue,
    onValueChange,
    onAccept,
    onFileAccept,
    onFileReject,
    onFileValidate,
    onUpload,
    accept,
    maxFiles,
    maxSize,
    dir: dirProp,
    label,
    name,
    asChild,
    disabled = false,
    invalid = false,
    multiple = false,
    required = false,
    children,
    className,
    ...rootProps
  } = props

  const inputId = useId()
  const dropzoneId = useId()
  const listId = useId()
  const labelId = useId()

  const dir = useDirection(dirProp)
  const propsRef = useAsRef(props)
  const listeners = useLazyRef(() => new Set<() => void>()).current
  const files = useLazyRef<Map<File, FileState>>(() => new Map()).current
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined

  const { root, input, label: labelClass } = fileUploadStyles()

  const store = useMemo(
    () => createStore(listeners!, files!, onValueChange, invalid),
    [listeners, files, onValueChange, invalid],
  )

  const contextValue = useMemo(
    () => ({
      dropzoneId,
      inputId,
      listId,
      labelId,
      dir,
      disabled,
      inputRef,
    }),
    [dropzoneId, inputId, listId, labelId, dir, disabled],
  )

  useEffect(() => {
    if (isControlled) {
      store.dispatch({ variant: "SET_FILES", files: value })
    } else if (defaultValue && defaultValue.length > 0 && !store.getState().files.size) {
      store.dispatch({ variant: "SET_FILES", files: defaultValue })
    }
  }, [value, defaultValue, isControlled, store])

  const onFilesUpload = useCallback(
    async (files: File[]) => {
      try {
        for (const file of files) {
          store.dispatch({ variant: "SET_PROGRESS", file, progress: 0 })
        }

        if (propsRef.current.onUpload) {
          await propsRef.current.onUpload(files, {
            onProgress: (file, progress) => {
              store.dispatch({
                variant: "SET_PROGRESS",
                file,
                progress: Math.min(Math.max(0, progress), 100),
              })
            },
            onSuccess: (file) => {
              store.dispatch({ variant: "SET_SUCCESS", file })
            },
            onError: (file, error) => {
              store.dispatch({
                variant: "SET_ERROR",
                file,
                error: error.message ?? "Upload failed",
              })
            },
          })
        } else {
          for (const file of files) {
            store.dispatch({ variant: "SET_SUCCESS", file })
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"
        for (const file of files) {
          store.dispatch({
            variant: "SET_ERROR",
            file,
            error: errorMessage,
          })
        }
      }
    },
    [store, propsRef],
  )

  const onFilesChange = useCallback(
    (originalFiles: File[]) => {
      if (propsRef.current.disabled) return

      let filesToProcess = [...originalFiles]
      let invalid = false

      if (propsRef.current.maxFiles) {
        const currentCount = store.getState().files.size
        const remainingSlotCount = Math.max(0, propsRef.current.maxFiles - currentCount)

        if (remainingSlotCount < filesToProcess.length) {
          const rejectedFiles = filesToProcess.slice(remainingSlotCount)
          invalid = true

          filesToProcess = filesToProcess.slice(0, remainingSlotCount)

          for (const file of rejectedFiles) {
            let rejectionMessage = `Maximum ${propsRef.current.maxFiles} files allowed`

            if (propsRef.current.onFileValidate) {
              const validationMessage = propsRef.current.onFileValidate(file)
              if (validationMessage) {
                rejectionMessage = validationMessage
              }
            }

            propsRef.current.onFileReject?.(file, rejectionMessage)
          }
        }
      }

      const acceptedFiles: File[] = []
      const rejectedFiles: { file: File; message: string }[] = []

      for (const file of filesToProcess) {
        let rejected = false
        let rejectionMessage = ""

        if (propsRef.current.onFileValidate) {
          const validationMessage = propsRef.current.onFileValidate(file)
          if (validationMessage) {
            rejectionMessage = validationMessage
            propsRef.current.onFileReject?.(file, rejectionMessage)
            rejected = true
            invalid = true
            continue
          }
        }

        if (propsRef.current.accept) {
          const acceptTypes = propsRef.current.accept.split(",").map((t) => t.trim())
          const fileType = file.type
          const fileExtension = `.${file.name.split(".").pop()}`

          if (
            !acceptTypes.some(
              (type) =>
                type === fileType ||
                type === fileExtension ||
                (type.includes("/*") && fileType.startsWith(type.replace("/*", "/"))),
            )
          ) {
            rejectionMessage = "File type not accepted"
            propsRef.current.onFileReject?.(file, rejectionMessage)
            rejected = true
            invalid = true
          }
        }

        if (propsRef.current.maxSize && file.size > propsRef.current.maxSize) {
          rejectionMessage = "File too large"
          propsRef.current.onFileReject?.(file, rejectionMessage)
          rejected = true
          invalid = true
        }

        if (!rejected) {
          acceptedFiles.push(file)
        } else {
          rejectedFiles.push({ file, message: rejectionMessage })
        }
      }

      if (invalid) {
        store.dispatch({ variant: "SET_INVALID", invalid })
        setTimeout(() => {
          store.dispatch({ variant: "SET_INVALID", invalid: false })
        }, 2000)
      }

      if (acceptedFiles.length > 0) {
        store.dispatch({ variant: "ADD_FILES", files: acceptedFiles })

        if (isControlled && propsRef.current.onValueChange) {
          const currentFiles = Array.from(store.getState().files.values()).map((f) => f.file)
          propsRef.current.onValueChange([...currentFiles])
        }

        if (propsRef.current.onAccept) {
          propsRef.current.onAccept(acceptedFiles)
        }

        for (const file of acceptedFiles) {
          propsRef.current.onFileAccept?.(file)
        }

        if (propsRef.current.onUpload) {
          requestAnimationFrame(() => {
            onFilesUpload(acceptedFiles)
          })
        }
      }
    },
    [store, isControlled, propsRef, onFilesUpload],
  )

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      onFilesChange(files)
      event.target.value = ""
    },
    [onFilesChange],
  )

  const RootPrimitive = asChild ? Slot : "div"

  return (
    <DirectionContext.Provider value={dir}>
      <StoreContext.Provider value={store}>
        <FileUploadContext.Provider value={contextValue}>
          <RootPrimitive
            data-disabled={disabled ? "" : undefined}
            data-slot="file-upload"
            dir={dir}
            {...rootProps}
            ref={forwardedRef}
            className={tcx(root(), className)}
          >
            {children}
            <input
              type="file"
              id={inputId}
              aria-labelledby={labelId}
              aria-describedby={dropzoneId}
              ref={inputRef}
              tabIndex={-1}
              accept={accept}
              name={name}
              disabled={disabled}
              multiple={multiple}
              required={required}
              className={input()}
              onChange={onInputChange}
            />
            <span
              id={labelId}
              className={labelClass()}
            >
              {label ?? "File upload"}
            </span>
          </RootPrimitive>
        </FileUploadContext.Provider>
      </StoreContext.Provider>
    </DirectionContext.Provider>
  )
})
FileUploadRoot.displayName = ROOT_NAME

// 创建复合组件
const FileUpload = Object.assign(FileUploadRoot, {
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  List: FileUploadList,
  Item: FileUploadItem,
  ItemPreview: FileUploadItemPreview,
  ItemMetadata: FileUploadItemMetadata,
  ItemProgress: FileUploadItemProgress,
  ItemDelete: FileUploadItemDelete,
  Clear: FileUploadClear,
})

export {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  useStore as useFileUpload,
  type FileUploadRootProps,
}
