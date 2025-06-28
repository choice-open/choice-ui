import { RenderLeafProps } from "slate-react"
import type {
  CustomElement,
  CustomText,
  ExtendedRenderElement,
  ImageElement,
  MentionElement,
} from "../types"
import { AttachmentsEdit, Mention } from "../../components/element"

export const renderElement = (props: ExtendedRenderElement) => {
  const { attributes, children, element, editor, handleRemoveImage } = props

  switch ((element as CustomElement).type) {
    case "mention": {
      const mentionElement = element as MentionElement
      return (
        <Mention
          mentionElement={mentionElement}
          attributes={attributes}
        >
          {children}
        </Mention>
      )
    }
    case "image": {
      const imageElement = element as ImageElement
      return (
        <AttachmentsEdit
          imageElement={imageElement}
          handleRemoveImage={handleRemoveImage}
          editor={editor}
          element={element}
          attachments={imageElement.attachments}
          attributes={attributes}
        >
          {children}
        </AttachmentsEdit>
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

export const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props
  const customLeaf = leaf as CustomText
  let formattedChildren = children

  if (customLeaf.bold) {
    formattedChildren = <strong className="font-bold">{formattedChildren}</strong>
  }

  if (customLeaf.italic) {
    formattedChildren = <em className="italic">{formattedChildren}</em>
  }

  if (customLeaf.underline) {
    formattedChildren = <u className="underline">{formattedChildren}</u>
  }

  if (customLeaf.emoji) {
    formattedChildren = <span className="font-emoji text-xl leading-6">{formattedChildren}</span>
  }

  return <span {...attributes}>{formattedChildren}</span>
}
