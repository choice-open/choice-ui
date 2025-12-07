import { StoreState, StoreAction, FileState } from "./types"

export function createStore(
  listeners: Set<() => void>,
  files: Map<File, FileState>,
  onValueChange?: (files: File[]) => void,
  invalid?: boolean,
) {
  const initialState: StoreState = {
    files,
    dragOver: false,
    invalid: invalid ?? false,
  }

  let state = initialState

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.variant) {
      case "ADD_FILES": {
        for (const file of action.files) {
          files.set(file, {
            file,
            progress: 0,
            status: "idle",
          })
        }

        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file)
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_FILES": {
        const newFileSet = new Set(action.files)
        for (const existingFile of files.keys()) {
          if (!newFileSet.has(existingFile)) {
            files.delete(existingFile)
          }
        }

        for (const file of action.files) {
          const existingState = files.get(file)
          if (!existingState) {
            files.set(file, {
              file,
              progress: 0,
              status: "idle",
            })
          }
        }
        return { ...state, files }
      }

      case "SET_PROGRESS": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: action.progress,
            status: "uploading",
          })
        }
        return { ...state, files }
      }

      case "SET_SUCCESS": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            progress: 100,
            status: "success",
          })
        }
        return { ...state, files }
      }

      case "SET_ERROR": {
        const fileState = files.get(action.file)
        if (fileState) {
          files.set(action.file, {
            ...fileState,
            error: action.error,
            status: "error",
          })
        }
        return { ...state, files }
      }

      case "REMOVE_FILE": {
        files.delete(action.file)

        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file)
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_DRAG_OVER": {
        return { ...state, dragOver: action.dragOver }
      }

      case "SET_INVALID": {
        return { ...state, invalid: action.invalid }
      }

      case "CLEAR": {
        files.clear()
        if (onValueChange) {
          onValueChange([])
        }
        return { ...state, files, invalid: false }
      }

      default:
        return state
    }
  }

  function getState() {
    return state
  }

  function dispatch(action: StoreAction) {
    state = reducer(state, action)
    for (const listener of listeners) {
      listener()
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, dispatch, subscribe }
}
