import { type UseFloatingReturn } from "@floating-ui/react"

// Editor state management types
export interface EditorStateType {
  characters: {
    isStyleOpen: boolean
    setIsStyleOpen: (value: boolean) => void
    setSwitchUrlInput: (value: boolean) => void
    setUrl: (value: string) => void
    switchUrlInput: boolean
    url: string
  }
  paragraph: {
    isExpanded: boolean
    isStyleOpen: boolean
    setIsExpanded: (value: boolean) => void
    setIsStyleOpen: (value: boolean) => void
  }
  url: {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
  }
}

// Editor state from use-editor-state.ts (to be consolidated)
export interface EditorState {
  charactersUrl: string
  isCharactersStyleOpen: boolean
  isParagraphExpanded: boolean
  isParagraphStyleOpen: boolean
  isUrlOpen: boolean
  switchUrlInput: boolean
}

export type EditorAction =
  | { payload: boolean; type: "SET_PARAGRAPH_EXPANDED" }
  | { payload: boolean; type: "SET_PARAGRAPH_STYLE_OPEN" }
  | { payload: boolean; type: "SET_CHARACTERS_STYLE_OPEN" }
  | { payload: boolean; type: "SET_SWITCH_URL_INPUT" }
  | { payload: string; type: "SET_CHARACTERS_URL" }
  | { payload: boolean; type: "SET_URL_OPEN" }

// Floating UI state management
export interface FloatingUIState {
  characters: FloatingMenuState
  paragraphCollapsed: FloatingMenuState
  paragraphExpanded: FloatingMenuState
  slateRef: React.RefObject<HTMLDivElement>
  updateAll?: () => void
  url: Omit<FloatingMenuState, "x" | "y">
}

export interface FloatingMenuState {
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  placement?: string
  refs: UseFloatingReturn["refs"]
  update: () => void
  x: number
  y: number
}
