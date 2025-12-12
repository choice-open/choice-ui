import type { ReactNode } from "react"

// Button variant types
export type AlertDialogButtonVariant =
  | "primary"
  | "secondary"
  | "solid"
  | "destructive"
  | "secondary-destruct"
  | "inverse"
  | "success"
  | "link"
  | "link-danger"
  | "ghost"
  | "dark"
  | "reset"

// Dialog variant types
export type AlertDialogVariant = "default" | "danger" | "success" | "warning"

// Button configuration
export interface AlertDialogButton {
  autoFocus?: boolean
  disabled?: boolean
  text: string
  value: string
  variant?: AlertDialogButtonVariant
}

// Base configuration interface
export interface AlertDialogBaseConfig {
  className?: string
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  content?: ReactNode
  description?: string
  showCloseButton?: boolean
  size?: "small" | "default" | "large"
  title?: string
  variant?: AlertDialogVariant
}

// Confirm dialog configuration
export interface AlertDialogConfirmConfig extends AlertDialogBaseConfig {
  cancelText?: string
  cancelVariant?: AlertDialogButtonVariant
  confirmText?: string
  confirmVariant?: AlertDialogButtonVariant
}

// Alert dialog configuration
export interface AlertDialogAlertConfig extends AlertDialogBaseConfig {
  confirmText?: string
  confirmVariant?: AlertDialogButtonVariant
}

// Custom dialog configuration
export interface AlertDialogCustomConfig extends AlertDialogBaseConfig {
  buttons: AlertDialogButton[]
}

// Dialog configuration union type
export type AlertDialogConfig =
  | AlertDialogConfirmConfig
  | AlertDialogAlertConfig
  | AlertDialogCustomConfig

// Dialog type
export type AlertDialogType = "confirm" | "alert" | "custom"

// Dialog result type
export type AlertDialogResult = boolean | void | string

// Dialog state
export interface AlertDialogState {
  config: AlertDialogConfig | null
  isOpen: boolean
  queue: Array<{
    config: AlertDialogConfig
    resolve: (value: AlertDialogResult) => void
    type: AlertDialogType
  }>
  resolve: ((value: AlertDialogResult) => void) | null
  type: AlertDialogType | null
}

// Dialog action type
export type AlertDialogAction =
  | {
      payload: {
        config: AlertDialogConfig
        dialogType: AlertDialogType
        resolve: (value: AlertDialogResult) => void
      }
      type: "SHOW"
    }
  | { payload: { value: AlertDialogResult }; type: "HIDE" }
  | { type: "NEXT" }
  | { type: "CLEAR_QUEUE" }

// Hook return type
export interface UseAlertDialogReturn {
  /**
   * Show alert dialog
   * @param config String or config object
   * @returns Promise<void> Resolves when user confirms
   */
  alert: (config: string | AlertDialogAlertConfig) => Promise<void>

  /**
   * Close all dialogs
   */
  closeAll: () => void

  /**
   * Show confirm dialog
   * @param config String or config object
   * @returns Promise<boolean> Returns user selection result
   */
  confirm: (config: string | AlertDialogConfirmConfig) => Promise<boolean>

  /**
   * Show custom dialog
   * @param config Custom config object
   * @returns Promise<string> Returns selected button value
   */
  show: (config: AlertDialogCustomConfig) => Promise<string>

  /**
   * Current dialog state
   */
  state: AlertDialogState
}

// Context type
export interface AlertDialogContextType extends UseAlertDialogReturn {
  // Internal method
  _handleAction: (action: AlertDialogAction) => void
}

// Simplified confirm and alert function types
export type ConfirmFunction = (config: string | AlertDialogConfirmConfig) => Promise<boolean>
export type AlertFunction = (config: string | AlertDialogAlertConfig) => Promise<void>
export type ShowFunction = (config: AlertDialogCustomConfig) => Promise<string>
