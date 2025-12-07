import { ReactNode } from "react"

// 按钮变体类型
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

// 对话框变体类型
export type AlertDialogVariant = "default" | "danger" | "success" | "warning"

// 按钮配置
export interface AlertDialogButton {
  autoFocus?: boolean
  disabled?: boolean
  text: string
  value: string
  variant?: AlertDialogButtonVariant
}

// 基础配置接口
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

// 确认对话框配置
export interface AlertDialogConfirmConfig extends AlertDialogBaseConfig {
  cancelText?: string
  cancelVariant?: AlertDialogButtonVariant
  confirmText?: string
  confirmVariant?: AlertDialogButtonVariant
}

// 提示对话框配置
export interface AlertDialogAlertConfig extends AlertDialogBaseConfig {
  confirmText?: string
  confirmVariant?: AlertDialogButtonVariant
}

// 自定义对话框配置
export interface AlertDialogCustomConfig extends AlertDialogBaseConfig {
  buttons: AlertDialogButton[]
}

// 对话框配置联合类型
export type AlertDialogConfig =
  | AlertDialogConfirmConfig
  | AlertDialogAlertConfig
  | AlertDialogCustomConfig

// 对话框类型
export type AlertDialogType = "confirm" | "alert" | "custom"

// 对话框返回值类型
export type AlertDialogResult = boolean | void | string

// 对话框状态
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

// 对话框操作类型
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

// Hook 返回值类型
export interface UseAlertDialogReturn {
  /**
   * 显示提示对话框
   * @param config 字符串或配置对象
   * @returns Promise<void> 用户确认后resolve
   */
  alert: (config: string | AlertDialogAlertConfig) => Promise<void>

  /**
   * 关闭所有对话框
   */
  closeAll: () => void

  /**
   * 显示确认对话框
   * @param config 字符串或配置对象
   * @returns Promise<boolean> 返回用户选择结果
   */
  confirm: (config: string | AlertDialogConfirmConfig) => Promise<boolean>

  /**
   * 显示自定义对话框
   * @param config 自定义配置对象
   * @returns Promise<string> 返回用户选择的按钮value
   */
  show: (config: AlertDialogCustomConfig) => Promise<string>

  /**
   * 当前对话框状态
   */
  state: AlertDialogState
}

// Context 类型
export interface AlertDialogContextType extends UseAlertDialogReturn {
  // 内部方法
  _handleAction: (action: AlertDialogAction) => void
}

// 简化的 confirm 和 alert 函数类型
export type ConfirmFunction = (config: string | AlertDialogConfirmConfig) => Promise<boolean>
export type AlertFunction = (config: string | AlertDialogAlertConfig) => Promise<void>
export type ShowFunction = (config: AlertDialogCustomConfig) => Promise<string>
