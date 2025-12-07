import { useContext } from "react"
import { FileUploadContext, FileUploadItemContext } from "../contexts"
import { FILE_UPLOAD_ERRORS } from "../constants"

/**
 * 获取文件上传组件上下文的 Hook
 *
 * 这个 Hook 用于在子组件中访问文件上传组件的共享状态和方法。
 * 如果在非文件上传组件树中使用，会抛出错误。
 *
 * @param name - 组件名称，用于生成错误信息
 * @returns 文件上传组件的上下文对象
 * @throws 如果在非文件上传组件树中使用，抛出错误
 *
 * @example
 * ```tsx
 * const Dropzone = () => {
 *   const { inputRef, disabled } = useFileUploadContext('FileUploadDropzone')
 *
 *   const handleClick = () => {
 *     if (!disabled) {
 *       inputRef.current?.click()
 *     }
 *   }
 *
 *   return <div onClick={handleClick}>点击上传</div>
 * }
 * ```
 */
export function useFileUploadContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(FileUploadContext)
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name])
  }
  return context
}

/**
 * 获取文件上传项目上下文的 Hook
 *
 * 这个 Hook 用于在文件项目的子组件中访问单个文件的状态信息。
 * 必须在 FileUploadItem 组件内部使用。
 *
 * @param name - 组件名称，用于生成错误信息
 * @returns 文件项目的上下文对象，包含文件状态和相关 ID
 * @throws 如果在非文件项目组件内使用，抛出错误
 *
 * @example
 * ```tsx
 * const FilePreview = () => {
 *   const { fileState, nameId } = useFileUploadItemContext('FileUploadItemPreview')
 *
 *   if (!fileState) return null
 *
 *   return (
 *     <div>
 *       <span id={nameId}>{fileState.file.name}</span>
 *       <span>状态: {fileState.status}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFileUploadItemContext(name: keyof typeof FILE_UPLOAD_ERRORS) {
  const context = useContext(FileUploadItemContext)
  if (!context) {
    throw new Error(FILE_UPLOAD_ERRORS[name])
  }
  return context
}
