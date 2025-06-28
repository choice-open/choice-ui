import { memo } from "react"
import { RenderElementProps } from "slate-react"
import type { Attachment, ImageElement } from "../../comment-input/types"
import { CommentInputElementTv } from "./tv"

interface AttachmentsCommentProps extends Omit<RenderElementProps, "element" | "children"> {
  attachments: Attachment[]
  children?: React.ReactNode
  handleOnImageClick?: (attachmentIndex?: number) => void
  imageElement: ImageElement
}

export const AttachmentsComment = memo(function AttachmentsComment(props: AttachmentsCommentProps) {
  const { imageElement, handleOnImageClick, children } = props

  const styles = CommentInputElementTv()

  return (
    <div
      contentEditable={false}
      className={styles.attachmentsRoot()}
      draggable={false}
    >
      <div
        className={styles.attachmentsWrapper({
          attachmentsMode: "comment",
          multipleAttachments: imageElement.attachments.length > 1,
        })}
      >
        {imageElement.attachments && imageElement.attachments.length > 0
          ? imageElement.attachments.map((attachment, index) => (
              <div
                key={index}
                className={styles.attachmentRoot({
                  attachmentsMode: "comment",
                  multipleAttachments: imageElement.attachments.length > 1,
                })}
                draggable={false}
              >
                <button
                  onClick={() => {
                    handleOnImageClick?.(index)
                  }}
                  className={styles.AttachmentWrapper({ attachmentsMode: "comment" })}
                  draggable={false}
                >
                  <img
                    src={attachment.url}
                    className={styles.attachmentImage()}
                    alt={attachment.name || ""}
                    draggable={false}
                  />
                </button>
              </div>
            ))
          : null}
        {children}
      </div>
    </div>
  )
})

AttachmentsComment.displayName = "AttachmentsComment"
