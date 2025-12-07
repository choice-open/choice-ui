import { IconButton } from "@choiceform/icon-button"
import { RemoveSmall } from "@choiceform/icons-react"
import { memo } from "react"
import { Path } from "slate"
import { ReactEditor, RenderElementProps } from "slate-react"
import type { Attachment, CustomElement, ImageElement } from "../../comment-input/types"
import { CommentInputElementTv } from "./tv"

interface AttachmentsEditProps extends Omit<RenderElementProps, "element"> {
  attachments: Attachment[]
  editor: ReactEditor
  element: CustomElement
  handleRemoveImage?: (path: Path, attachmentIndex?: number) => void
  imageElement: ImageElement
}

export const AttachmentsEdit = memo(function AttachmentsEdit(props: AttachmentsEditProps) {
  const { imageElement, handleRemoveImage, editor, element, children } = props

  const styles = CommentInputElementTv()

  // 禁止图片拖拽的处理函数
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // 阻止默认的拖放行为
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  return (
    <div
      contentEditable={false}
      className={styles.attachmentsRoot()}
      // 添加拖拽相关事件处理
      onDragStart={handleDragStart}
      onDrag={handleDragStart}
      onDragEnd={handleDragStart}
      onDrop={handleDrop}
      draggable={false}
    >
      <div
        className={styles.attachmentsWrapper({
          attachmentsMode: "edit",
        })}
      >
        {imageElement.attachments && imageElement.attachments.length > 0
          ? imageElement.attachments.map((attachment, index) => (
              <div
                key={index}
                className={styles.attachmentRoot({ attachmentsMode: "edit" })}
                draggable={false}
              >
                <div
                  className={styles.AttachmentWrapper({ attachmentsMode: "edit" })}
                  draggable={false}
                >
                  <img
                    src={attachment.url}
                    className={styles.attachmentImage()}
                    alt={attachment.name || ""}
                    draggable={false}
                    onDragStart={handleDragStart}
                  />
                </div>

                {handleRemoveImage && (
                  <IconButton
                    onClick={() => {
                      const path = ReactEditor.findPath(editor, element)
                      handleRemoveImage(path, index)
                    }}
                    variant="reset"
                    size="reset"
                    className={styles.attachmentRemoveButton()}
                  >
                    <RemoveSmall />
                  </IconButton>
                )}
              </div>
            ))
          : null}
        {children}
      </div>
    </div>
  )
})

AttachmentsEdit.displayName = "AttachmentsEdit"
