import type {
  AlertDialogAction,
  AlertDialogAlertConfig,
  AlertDialogButton,
  AlertDialogButtonVariant,
  AlertDialogConfirmConfig,
  AlertDialogResult,
  AlertDialogState,
  AlertDialogType,
} from "../types"

// Default button text
export const DEFAULT_CONFIRM_TEXT = "Confirm"
export const DEFAULT_CANCEL_TEXT = "Cancel"
export const DEFAULT_ALERT_TEXT = "OK"

// Default button variants
export const DEFAULT_CONFIRM_VARIANT: AlertDialogButtonVariant = "primary"
export const DEFAULT_CANCEL_VARIANT: AlertDialogButtonVariant = "secondary"

// Initial state
export const initialState: AlertDialogState = {
  isOpen: false,
  type: null,
  config: null,
  resolve: null,
  queue: [],
}

// State management reducer
export const alertDialogReducer = (
  state: AlertDialogState,
  action: AlertDialogAction,
): AlertDialogState => {
  switch (action.type) {
    case "SHOW": {
      const { dialogType, config, resolve } = action.payload

      // If dialog is already open, add to queue
      if (state.isOpen) {
        return {
          ...state,
          queue: [...state.queue, { type: dialogType, config, resolve }],
        }
      }

      // Otherwise show directly
      return {
        ...state,
        isOpen: true,
        type: dialogType,
        config,
        resolve,
      }
    }

    case "HIDE": {
      const { value } = action.payload

      // Resolve current Promise
      if (state.resolve) {
        state.resolve(value)
      }

      // If there are dialogs waiting in queue, show next one
      if (state.queue.length > 0) {
        const next = state.queue[0]
        return {
          ...state,
          type: next.type,
          config: next.config,
          resolve: next.resolve,
          queue: state.queue.slice(1),
        }
      }

      // Otherwise close dialog
      return {
        ...state,
        isOpen: false,
        type: null,
        config: null,
        resolve: null,
      }
    }

    case "NEXT": {
      // Handle next dialog in queue
      if (state.queue.length > 0) {
        const next = state.queue[0]
        return {
          ...state,
          type: next.type,
          config: next.config,
          resolve: next.resolve,
          queue: state.queue.slice(1),
        }
      }

      // If no queue, close dialog
      return {
        ...state,
        isOpen: false,
        type: null,
        config: null,
        resolve: null,
      }
    }

    case "CLEAR_QUEUE": {
      // Clear queue and close dialog
      return {
        ...state,
        isOpen: false,
        type: null,
        config: null,
        resolve: null,
        queue: [],
      }
    }

    default:
      return state
  }
}

// Normalize confirm dialog config
export const normalizeConfirmConfig = (
  config: string | AlertDialogConfirmConfig,
): AlertDialogConfirmConfig => {
  if (typeof config === "string") {
    return {
      description: config,
      confirmText: DEFAULT_CONFIRM_TEXT,
      cancelText: DEFAULT_CANCEL_TEXT,
      confirmVariant: DEFAULT_CONFIRM_VARIANT,
      cancelVariant: DEFAULT_CANCEL_VARIANT,
    }
  }

  return {
    confirmText: DEFAULT_CONFIRM_TEXT,
    cancelText: DEFAULT_CANCEL_TEXT,
    confirmVariant: DEFAULT_CONFIRM_VARIANT,
    cancelVariant: DEFAULT_CANCEL_VARIANT,
    ...config,
  }
}

// Normalize alert dialog config
export const normalizeAlertConfig = (
  config: string | AlertDialogAlertConfig,
): AlertDialogAlertConfig => {
  if (typeof config === "string") {
    return {
      description: config,
      confirmText: DEFAULT_ALERT_TEXT,
      confirmVariant: DEFAULT_CONFIRM_VARIANT,
    }
  }

  return {
    confirmText: DEFAULT_ALERT_TEXT,
    confirmVariant: DEFAULT_CONFIRM_VARIANT,
    ...config,
  }
}

// Generate button configuration based on dialog type
export const getButtonsForDialog = (
  type: AlertDialogType,
  config: AlertDialogConfirmConfig | AlertDialogAlertConfig,
): AlertDialogButton[] => {
  if (type === "confirm") {
    const confirmConfig = config as AlertDialogConfirmConfig
    return [
      {
        text: confirmConfig.cancelText || DEFAULT_CANCEL_TEXT,
        value: "cancel",
        variant: confirmConfig.cancelVariant || DEFAULT_CANCEL_VARIANT,
      },
      {
        text: confirmConfig.confirmText || DEFAULT_CONFIRM_TEXT,
        value: "confirm",
        variant: confirmConfig.confirmVariant || DEFAULT_CONFIRM_VARIANT,
        autoFocus: true,
      },
    ]
  }

  if (type === "alert") {
    const alertConfig = config as AlertDialogAlertConfig
    return [
      {
        text: alertConfig.confirmText || DEFAULT_ALERT_TEXT,
        value: "confirm",
        variant: alertConfig.confirmVariant || DEFAULT_CONFIRM_VARIANT,
        autoFocus: true,
      },
    ]
  }

  return []
}

// Process button click result
export const processButtonResult = (
  type: AlertDialogType,
  buttonValue: string,
): AlertDialogResult => {
  if (type === "confirm") {
    return buttonValue === "confirm"
  }

  if (type === "alert") {
    return undefined
  }

  return buttonValue
}

// Generate dialog title
export const getDialogTitle = (
  type: AlertDialogType,
  config: AlertDialogConfirmConfig | AlertDialogAlertConfig,
): string => {
  if (config.title) {
    return config.title
  }

  switch (type) {
    case "confirm":
      return "Confirm"
    case "alert":
      return "Alert"
    default:
      return ""
  }
}

// Check if close button should be shown
export const shouldShowCloseButton = (
  type: AlertDialogType,
  config: AlertDialogConfirmConfig | AlertDialogAlertConfig,
): boolean => {
  // If showCloseButton is explicitly set, use that value
  if (config.showCloseButton !== undefined) {
    return config.showCloseButton
  }

  // By default, only confirm type shows close button
  return type === "confirm"
}
