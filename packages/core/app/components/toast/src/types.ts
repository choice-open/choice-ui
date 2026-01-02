import type React from "react"

export type ToastType = "info" | "success" | "warning" | "error" | "loading" | "default"

export type ToastVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "assistive"
  | "reset"

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export type SwipeDirection = "up" | "down" | "left" | "right"

export interface ToastData<T extends object = object> {
  id: string
  type: ToastType
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  priority?: number
  data?: T
  createdAt: number
  onClose?: () => void
  onAction?: () => void
  actionLabel?: React.ReactNode
  // Internal state for animations
  height?: number
  swipeDirection?: SwipeDirection
}

export interface ToastManagerAddOptions<T extends object = object> {
  id?: string
  type?: ToastType
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  priority?: number
  data?: T
  onClose?: () => void
  onAction?: () => void
  actionLabel?: React.ReactNode
}

export interface ToastManagerUpdateOptions<T extends object = object> {
  type?: ToastType
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  data?: T
  actionLabel?: React.ReactNode
}

export interface ToastManagerPromiseOptions<Value, T extends object = object> {
  loading: ToastManagerAddOptions<T>
  success: ToastManagerAddOptions<T> | ((value: Value) => ToastManagerAddOptions<T>)
  error: ToastManagerAddOptions<T> | ((error: unknown) => ToastManagerAddOptions<T>)
}

export type ToastManagerAction = "add" | "close" | "update" | "promise"

export interface ToastManagerEvent {
  action: ToastManagerAction
  options: unknown
}

export interface ToastManager {
  subscribe: (listener: (event: ToastManagerEvent) => void) => () => void
  add: <T extends object = object>(options: ToastManagerAddOptions<T>) => string
  close: (id: string) => void
  update: <T extends object = object>(id: string, updates: ToastManagerUpdateOptions<T>) => void
  promise: <Value, T extends object = object>(
    promiseValue: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>,
  ) => Promise<Value>
  // Convenience methods
  success: <T extends object = object>(options: Omit<ToastManagerAddOptions<T>, "type">) => string
  error: <T extends object = object>(options: Omit<ToastManagerAddOptions<T>, "type">) => string
  warning: <T extends object = object>(options: Omit<ToastManagerAddOptions<T>, "type">) => string
  info: <T extends object = object>(options: Omit<ToastManagerAddOptions<T>, "type">) => string
  loading: <T extends object = object>(options: Omit<ToastManagerAddOptions<T>, "type">) => string
  // Cleanup method
  destroy: () => void
}

export interface TimerInfo {
  timeout?: ReturnType<typeof setTimeout>
  start: number
  delay: number
  remaining: number
  callback: () => void
}

export interface ToastRootState {
  type: ToastType
  swiping: boolean
  expanded: boolean
}

export interface ToastContentState {
  expanded: boolean
  behind: boolean
}
