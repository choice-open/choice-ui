import {
  AlertDialogAction,
  AlertDialogAlertConfig,
  AlertDialogButton,
  AlertDialogButtonVariant,
  AlertDialogConfirmConfig,
  AlertDialogResult,
  AlertDialogState,
  AlertDialogType,
} from "./types"

// 默认按钮文本
export const DEFAULT_CONFIRM_TEXT = "Confirm"
export const DEFAULT_CANCEL_TEXT = "Cancel"
export const DEFAULT_ALERT_TEXT = "OK"

// 默认按钮变体
export const DEFAULT_CONFIRM_VARIANT: AlertDialogButtonVariant = "primary"
export const DEFAULT_CANCEL_VARIANT: AlertDialogButtonVariant = "secondary"

// 初始状态
export const initialState: AlertDialogState = {
  isOpen: false,
  type: null,
  config: null,
  resolve: null,
  queue: [],
}

// 状态管理 reducer
export const alertDialogReducer = (
  state: AlertDialogState,
  action: AlertDialogAction,
): AlertDialogState => {
  switch (action.type) {
    case "SHOW": {
      const { dialogType, config, resolve } = action.payload

      // 如果当前已经有对话框打开，添加到队列
      if (state.isOpen) {
        return {
          ...state,
          queue: [...state.queue, { type: dialogType, config, resolve }],
        }
      }

      // 否则直接显示
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

      // 解析当前的 Promise
      if (state.resolve) {
        state.resolve(value)
      }

      // 如果队列中有等待的对话框，显示下一个
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

      // 否则关闭对话框
      return {
        ...state,
        isOpen: false,
        type: null,
        config: null,
        resolve: null,
      }
    }

    case "NEXT": {
      // 处理队列中的下一个对话框
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

      // 如果没有队列，关闭对话框
      return {
        ...state,
        isOpen: false,
        type: null,
        config: null,
        resolve: null,
      }
    }

    case "CLEAR_QUEUE": {
      // 清空队列并关闭对话框
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

// 规范化确认对话框配置
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

// 规范化提示对话框配置
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

// 根据对话框类型生成按钮配置
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

// 处理按钮点击结果
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

// 生成对话框标题
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

// 检查是否应该显示关闭按钮
export const shouldShowCloseButton = (
  type: AlertDialogType,
  config: AlertDialogConfirmConfig | AlertDialogAlertConfig,
): boolean => {
  // 如果明确设置了 showCloseButton，使用该设置
  if (config.showCloseButton !== undefined) {
    return config.showCloseButton
  }

  // 默认只有 confirm 类型显示关闭按钮
  return type === "confirm"
}
