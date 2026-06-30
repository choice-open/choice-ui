import {
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuEmpty,
  type MenuContextItemProps,
} from "@choice-ui/menus"
import { flattenSlotChildren, isSlotChild } from "@choice-ui/shared"
import React from "react"

export function extractItemElements(children: React.ReactNode) {
  if (!children) return []

  return flattenSlotChildren(children).filter(
    (child) =>
      isSlotChild(child, MenuContextItem) ||
      isSlotChild(child, MenuDivider) ||
      isSlotChild(child, MenuContextLabel) ||
      isSlotChild(child, MenuEmpty),
  )
}

export function processOptions(itemElements: React.ReactElement[]) {
  if (itemElements.length === 0) return []

  return itemElements.map((child, index) => {
    if (isSlotChild(child, MenuDivider)) {
      return { divider: true }
    }

    if (isSlotChild(child, MenuContextLabel)) {
      return { label: true, children: child.props.children }
    }

    if (isSlotChild(child, MenuEmpty)) {
      return { empty: true, children: child.props.children, element: child }
    }

    // Extract props from MenuContextItem element
    const {
      value: itemValue,
      children: itemChildren,
      disabled: itemDisabled,
    } = child.props as MenuContextItemProps

    return {
      value: itemValue,
      disabled: itemDisabled,
      _originalIndex: index,
      element: child,
      children: itemChildren,
    }
  })
}

export function filterSelectableOptions(
  options: Array<{
    disabled?: boolean
    divider?: boolean
    element?: React.ReactElement
    empty?: boolean
    label?: boolean
    value?: string
  }>,
) {
  return options.filter((option) => !option.divider && !option.label && !option.empty)
}
