import { RenderElementProps } from "slate-react"
import type { CustomElement, ImageElement, MentionElement } from "../../comment-input/types"
import { AttachmentsComment, Mention } from "../../components/element"

interface ExtendedRenderElementProps extends RenderElementProps {
  handleOnImageClick?: (attachmentIndex?: number) => void
}

export const renderElementWrapper = (props: ExtendedRenderElementProps) => {
  const { attributes, children, element, handleOnImageClick } = props

  switch ((element as CustomElement).type) {
    case "mention": {
      const mentionElement = element as MentionElement
      return (
        <Mention
          mentionElement={mentionElement}
          attributes={attributes}
          className="cursor-pointer"
        />
      )
    }
    case "image": {
      const imageElement = element as ImageElement
      return (
        <AttachmentsComment
          imageElement={imageElement}
          handleOnImageClick={handleOnImageClick}
          attachments={imageElement.attachments}
          attributes={attributes}
        />
      )
    }
    case "paragraph":
      return (
        <p
          {...attributes}
          className="tracking-md leading-6 break-words whitespace-break-spaces"
        >
          {children}
        </p>
      )
    case "list-item":
      return (
        <li
          {...attributes}
          className="ml-4"
        >
          {children}
        </li>
      )
    case "numbered-list":
      return (
        <ol
          {...attributes}
          className="list-decimal"
        >
          {children}
        </ol>
      )
    case "bulleted-list":
      return (
        <ul
          {...attributes}
          className="list-disc"
        >
          {children}
        </ul>
      )
    default:
      return (
        <p
          {...attributes}
          className="tracking-md leading-6 break-words whitespace-break-spaces"
        >
          {children}
        </p>
      )
  }
}
