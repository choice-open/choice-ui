import { forwardRef, type ReactNode } from "react"
import type { ToastType } from "../types"

// Types for action/cancel buttons
export interface ToastAction {
  label: ReactNode
  onClick: () => void
}

export interface ToastCancel {
  label: ReactNode
  onClick?: () => void
}

/**
 * Props for Toaster.Item slot component
 */
export interface ToasterItemSlotProps {
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}

/**
 * Slot component for customizing toast item container
 */
export const ToasterItemSlot = forwardRef<HTMLDivElement, ToasterItemSlotProps>(
  function ToasterItemSlot(_props, _ref) {
    return null
  },
)
ToasterItemSlot.displayName = "Toaster.Item"

/**
 * Props for Toaster.Icon slot component
 */
export interface ToasterIconSlotProps {
  className?: string
  style?: React.CSSProperties
  /** Custom render function - receives type and default icon */
  children?: (type: ToastType, defaultIcon: ReactNode) => ReactNode
}

/**
 * Slot component for customizing toast icon
 */
export const ToasterIconSlot = forwardRef<HTMLDivElement, ToasterIconSlotProps>(
  function ToasterIconSlot(_props, _ref) {
    return null
  },
)
ToasterIconSlot.displayName = "Toaster.Icon"

/**
 * Props for Toaster.Title slot component
 */
export interface ToasterTitleSlotProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Slot component for customizing toast title
 */
export const ToasterTitleSlot = forwardRef<HTMLDivElement, ToasterTitleSlotProps>(
  function ToasterTitleSlot(_props, _ref) {
    return null
  },
)
ToasterTitleSlot.displayName = "Toaster.Title"

/**
 * Props for Toaster.Description slot component
 */
export interface ToasterDescriptionSlotProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Slot component for customizing toast description
 */
export const ToasterDescriptionSlot = forwardRef<HTMLDivElement, ToasterDescriptionSlotProps>(
  function ToasterDescriptionSlot(_props, _ref) {
    return null
  },
)
ToasterDescriptionSlot.displayName = "Toaster.Description"

/**
 * Props for Toaster.Actions slot component
 */
export interface ToasterActionsSlotProps {
  className?: string
  style?: React.CSSProperties
  /** Custom render function for actions */
  children?: (
    action: ToastAction | undefined,
    cancel: ToastCancel | undefined,
    close: () => void,
  ) => ReactNode
}

/**
 * Slot component for customizing toast actions
 */
export const ToasterActionsSlot = forwardRef<HTMLDivElement, ToasterActionsSlotProps>(
  function ToasterActionsSlot(_props, _ref) {
    return null
  },
)
ToasterActionsSlot.displayName = "Toaster.Actions"

/**
 * Collected slot props from Toaster.Item children
 */
export interface CollectedSlotProps {
  // Item container
  itemClassName?: string
  itemStyle?: React.CSSProperties
  // Icon
  iconClassName?: string
  iconStyle?: React.CSSProperties
  renderIcon?: (type: ToastType, defaultIcon: ReactNode) => ReactNode
  // Title
  titleClassName?: string
  titleStyle?: React.CSSProperties
  // Description
  descriptionClassName?: string
  descriptionStyle?: React.CSSProperties
  // Actions
  actionsClassName?: string
  actionsStyle?: React.CSSProperties
  renderActions?: (
    action: ToastAction | undefined,
    cancel: ToastCancel | undefined,
    close: () => void,
  ) => ReactNode
}
