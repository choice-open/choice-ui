import { memo, useMemo, useState } from "react"
import { Dialog } from "~/components/dialog"
import { PicturePreview } from "~/components/picture-preview"
import { SubmittedCommentData } from "../types"

interface ImagePreviewPopoverProps {
  currentCommentId: string | null
  filteredComments: SubmittedCommentData[]
  isOpen: boolean
  onOpenImage: number | undefined
  setIsOpen: (open: boolean) => void
}

export const ImagePreviewPopover = memo(function ImagePreviewPopover(
  props: ImagePreviewPopoverProps,
) {
  const { onOpenImage, currentCommentId, filteredComments, isOpen, setIsOpen } = props

  // 获取当前图片 - 修改为只在特定评论中查找
  const currentImage = useMemo(() => {
    if (onOpenImage === undefined || !currentCommentId) return undefined

    // 找到当前评论
    const currentComment = filteredComments.find((c) => c.uuid === currentCommentId)
    if (!currentComment) return undefined

    // 只在当前评论中查找图片
    for (const element of currentComment.message_meta) {
      if (
        "type" in element &&
        element.type === "image" &&
        "attachments" in element &&
        Array.isArray(element.attachments) &&
        element.attachments[onOpenImage]
      ) {
        return element.attachments[onOpenImage]
      }
    }

    return undefined
  }, [filteredComments, onOpenImage, currentCommentId])

  return (
    currentImage && (
      <Dialog
        className="overflow-hidden"
        open={isOpen}
        onOpenChange={setIsOpen}
        draggable
      >
        <Dialog.Header title={currentImage.name} />
        <Dialog.Content className="w-[50vw] min-w-96 overflow-hidden">
          <PicturePreview
            src={currentImage.url}
            fileName={currentImage.name}
            onClose={() => setIsOpen(false)}
          />
        </Dialog.Content>
      </Dialog>
    )
  )
})

ImagePreviewPopover.displayName = "ImagePreviewPopover"
