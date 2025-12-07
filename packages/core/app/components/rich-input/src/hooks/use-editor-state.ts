import { useReducer, useCallback, useMemo } from "react"
import type { EditorStateType } from "../types"

interface EditorState {
  characters: {
    isStyleOpen: boolean
    switchUrlInput: boolean
    url: string
  }
  paragraph: {
    isExpanded: boolean
    isStyleOpen: boolean
  }
  url: {
    isOpen: boolean
  }
}

type EditorAction =
  | { payload: boolean; type: "SET_CHARACTERS_STYLE_OPEN" }
  | { payload: string; type: "SET_CHARACTERS_URL" }
  | { payload: boolean; type: "SET_SWITCH_URL_INPUT" }
  | { payload: boolean; type: "SET_URL_OPEN" }
  | { payload: boolean; type: "SET_PARAGRAPH_STYLE_OPEN" }
  | { payload: boolean; type: "SET_PARAGRAPH_EXPANDED" }

const initialState: EditorState = {
  characters: {
    isStyleOpen: false,
    url: "",
    switchUrlInput: false,
  },
  url: {
    isOpen: false,
  },
  paragraph: {
    isStyleOpen: false,
    isExpanded: false,
  },
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_CHARACTERS_STYLE_OPEN":
      return {
        ...state,
        characters: { ...state.characters, isStyleOpen: action.payload },
      }
    case "SET_CHARACTERS_URL":
      return {
        ...state,
        characters: { ...state.characters, url: action.payload },
      }
    case "SET_SWITCH_URL_INPUT":
      return {
        ...state,
        characters: { ...state.characters, switchUrlInput: action.payload },
      }
    case "SET_URL_OPEN":
      return {
        ...state,
        url: { ...state.url, isOpen: action.payload },
      }
    case "SET_PARAGRAPH_STYLE_OPEN":
      return {
        ...state,
        paragraph: { ...state.paragraph, isStyleOpen: action.payload },
      }
    case "SET_PARAGRAPH_EXPANDED":
      return {
        ...state,
        paragraph: { ...state.paragraph, isExpanded: action.payload },
      }
    default:
      return state
  }
}

export const useEditorState = (): EditorStateType => {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  const setIsCharactersStyleOpen = useCallback((value: boolean) => {
    dispatch({ type: "SET_CHARACTERS_STYLE_OPEN", payload: value })
  }, [])

  const setCharactersUrl = useCallback((value: string) => {
    dispatch({ type: "SET_CHARACTERS_URL", payload: value })
  }, [])

  const setSwitchUrlInput = useCallback((value: boolean) => {
    dispatch({ type: "SET_SWITCH_URL_INPUT", payload: value })
  }, [])

  const setIsUrlOpen = useCallback((value: boolean) => {
    dispatch({ type: "SET_URL_OPEN", payload: value })
  }, [])

  const setIsParagraphStyleOpen = useCallback((value: boolean) => {
    dispatch({ type: "SET_PARAGRAPH_STYLE_OPEN", payload: value })
  }, [])

  const setIsParagraphExpanded = useCallback((value: boolean) => {
    dispatch({ type: "SET_PARAGRAPH_EXPANDED", payload: value })
  }, [])

  // 缓存返回的状态对象，避免每次渲染都创建新对象
  return useMemo(
    () => ({
      characters: {
        isStyleOpen: state.characters.isStyleOpen,
        setIsStyleOpen: setIsCharactersStyleOpen,
        url: state.characters.url,
        setUrl: setCharactersUrl,
        switchUrlInput: state.characters.switchUrlInput,
        setSwitchUrlInput,
      },
      url: {
        isOpen: state.url.isOpen,
        setIsOpen: setIsUrlOpen,
      },
      paragraph: {
        isStyleOpen: state.paragraph.isStyleOpen,
        setIsStyleOpen: setIsParagraphStyleOpen,
        isExpanded: state.paragraph.isExpanded,
        setIsExpanded: setIsParagraphExpanded,
      },
    }),
    [
      state.characters.isStyleOpen,
      state.characters.url,
      state.characters.switchUrlInput,
      state.url.isOpen,
      state.paragraph.isStyleOpen,
      state.paragraph.isExpanded,
      setIsCharactersStyleOpen,
      setCharactersUrl,
      setSwitchUrlInput,
      setIsUrlOpen,
      setIsParagraphStyleOpen,
      setIsParagraphExpanded,
    ],
  )
}
