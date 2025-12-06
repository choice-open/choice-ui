import { Descendant, Editor } from "slate"
import { type EditableProps } from "slate-react/dist/components/editable"
import { type RenderElementProps, type RenderLeafProps } from "slate-react"
import { type UseFloatingReturn } from "@floating-ui/react"
import { type IconButtonProps } from "~/components"
import { CustomText, CustomElement, CustomElementWithType, CustomEditor } from "./slate-types"
import { EditorStateType, FloatingUIState } from "./state-types"
import { RichInputI18n } from "./i18n-types"

// Main component props
export interface RichInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  autoFocus?: boolean
  autoMoveToEnd?: boolean
  charactersOptionsProps?: RichOptionsProps[]
  className?: string
  disableTabFocus?: boolean
  editableClassName?: string
  editableProps?: EditableProps
  enterFormatting?: boolean
  i18n?: RichInputI18n
  minHeight?: number
  onChange?: (value: Descendant[]) => void
  onValidationChange?: React.Dispatch<React.SetStateAction<string | null>>
  paragraphOptionsProps?: RichOptionsProps[]
  placeholder?: string
  portalElementId?: string
  readOnly?: boolean
  validation?: {
    maxLength?: number
    minLength?: number
    required?: boolean
  }
  value: Descendant[]
}

export interface RichOptionsProps {
  format: string
  icon: React.ReactNode
}

// Component props
export interface RichInputEditableProps {
  className?: string
}

export interface RichInputViewportProps {
  children?: React.ReactNode
  className?: string
}

export interface FloatingMenusContainerProps {
  charactersOptions: RichOptionsProps[]
  editor: Editor
  editorInView: boolean
  editorState: EditorStateType
  enterFormatting: boolean
  floatingUI: FloatingUIState
  i18n: Required<RichInputI18n>
  isFocused: boolean
  isHover: boolean
  paragraphOptions: RichOptionsProps[]
  portalElementId?: string
}

export interface CharactersMenuProps {
  charactersOptions: RichOptionsProps[]
  charactersUrl: string
  editorInView: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  i18n: Required<RichInputI18n>
  isHover: boolean
  isOpen: boolean
  placement?: string
  portalElementId?: string
  refs: UseFloatingReturn["refs"]
  setCharactersUrl: (value: string) => void
  setIsCharactersStyleOpen: (value: boolean) => void
  setSwitchUrlInput: (value: boolean) => void
  switchUrlInput: boolean
  x: number
  y: number
}

export interface UrlInputProps {
  charactersUrl: string
  i18n: Required<RichInputI18n>
  isOpen?: boolean
  onAddUrl: () => void
  onChangeUrl: (value: string) => void
  onRemoveUrl: () => void
}

export interface ParagraphMenuProps {
  editor: Editor
  editorInView: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  isHover: boolean
  isOpen: boolean
  isParagraphExpanded: boolean
  paragraphOptions: RichOptionsProps[]
  placement?: string
  portalElementId?: string
  refs: UseFloatingReturn["refs"]
  setIsParagraphExpanded: (value: boolean) => void
  update: () => void
}

export interface UrlMenuProps {
  charactersUrl: string
  editorInView: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  isOpen: boolean
  portalElementId?: string
  refs: UseFloatingReturn["refs"]
}

export interface FloatingMenuContainerProps {
  children: React.ReactNode
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  onMouseDown?: (e: React.MouseEvent) => void
  portalElementId?: string
  refs: UseFloatingReturn["refs"]
  style?: React.CSSProperties
}

export interface MotionWrapperProps {
  animationType?: "scale" | "default"
  children: React.ReactNode
  className: string
  onMouseDown?: (e: React.MouseEvent) => void
  placement?: string
  style?: React.CSSProperties
}

export interface ElementRenderProps extends Omit<RenderElementProps, "element"> {
  element: CustomElementWithType
}

export interface LeafRenderProps extends RenderLeafProps {
  leaf: CustomText
}

export interface FormatButtonProps extends IconButtonProps {
  format?: keyof CustomText
}

export interface BlockButtonProps extends IconButtonProps {
  format?: keyof CustomElement
}

// Hook props
export interface UseEditorConfigProps {
  disableTabFocus?: boolean
  isParagraphExpanded?: boolean
  setIsParagraphExpanded?: (value: boolean) => void
}

export interface UseEditorEffectsProps {
  editor: CustomEditor
  isCharactersStyleOpen: boolean
  isParagraphStyleOpen: boolean
  setIsParagraphExpanded: (value: boolean) => void
  setSwitchUrlInput: (value: boolean) => void
  value: Descendant[]
}

export interface UseRichInputProps {
  autoFocus?: boolean
  autoMoveToEnd?: boolean
  editor?: Editor
  onChange?: (value: Descendant[]) => void
  value: Descendant[]
}

export interface UseSelectionEventsProps {
  charactersRefs: UseFloatingReturn["refs"]
  editor: Editor
  isParagraphExpanded: boolean
  paragraphCollapsedRefs: UseFloatingReturn["refs"]
  paragraphExpandedRefs: UseFloatingReturn["refs"]
  setCharactersUrl: (value: string) => void
  setIsCharactersStyleOpen: (value: boolean) => void
  setIsParagraphStyleOpen: (value: boolean) => void
  setIsUrlOpen: (value: boolean) => void
  slateRef: React.RefObject<HTMLDivElement>
  urlRefs: UseFloatingReturn["refs"]
}

export interface UseFloatingUIOptions {
  containerRect?: DOMRect
}

export interface UseValidationProps {
  charactersIsStyleOpen: boolean
  editorState: Descendant[]
  paragraphIsStyleOpen: boolean
  readOnly: boolean
  setCharactersUrl: (url: string) => void
  setSwitchUrlInput: (value: boolean) => void
  validation?: {
    maxLength?: number
    minLength?: number
    required?: boolean
  }
}

export interface TrimSlateValueToMaxLengthProps {
  editor: Editor
  maxLength: number
}

// Context props
export interface RichInputContextValue {
  autoFocus?: boolean
  charactersOptions: RichOptionsProps[]
  disableTabFocus?: boolean
  editableProps?: Record<string, unknown> | undefined
  editor: CustomEditor
  editorInView: boolean
  editorState: EditorStateType
  enterFormatting: boolean
  floatingUI: FloatingUIState
  handleEditorChange: (value: Descendant[]) => void
  i18n: Required<RichInputI18n>
  isFocused: boolean
  isHover: boolean
  minHeight?: number
  onBlur?: () => void
  onCompositionEnd?: (event: React.CompositionEvent) => void
  onCompositionStart?: (event: React.CompositionEvent) => void
  onFocus?: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
  paragraphOptions: RichOptionsProps[]
  placeholder?: string
  portalElementId?: string
  readOnly?: boolean
  renderElement: (props: RenderElementProps) => JSX.Element
  renderLeaf: (props: RenderLeafProps) => JSX.Element
  value: Descendant[]
  viewportRef: React.RefObject<HTMLDivElement>
}
