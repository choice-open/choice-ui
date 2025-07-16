import React, { Children, isValidElement } from "react"
import {
  MenuContextItem,
  MenuDivider,
  MenuContextLabel,
  type MenuContextItemProps,
} from "../../menus"

export function extractItemElements(children: React.ReactNode) {
  if (!children) return []

  const childrenArray = Children.toArray(children)

  // 递归函数处理Fragment内的子元素
  const extractItems = (children: React.ReactNode[]): React.ReactNode[] => {
    const result: React.ReactNode[] = []

    children.forEach((child) => {
      if (!isValidElement(child)) return

      if (
        child.type === MenuContextItem ||
        child.type === MenuDivider ||
        child.type === MenuContextLabel
      ) {
        result.push(child)
      } else if (child.type === React.Fragment && child.props.children) {
        const fragmentChildren = Children.toArray(child.props.children)
        result.push(...extractItems(fragmentChildren))
      }
    })

    return result
  }

  return extractItems(childrenArray)
}

export function processOptions(itemElements: React.ReactNode[]) {
  if (itemElements.length === 0) return []

  return itemElements.map((child, index) => {
    if (!isValidElement(child)) return { divider: true }

    if (child.type === MenuDivider) {
      return { divider: true }
    }

    if (child.type === MenuContextLabel) {
      return { label: true, children: child.props.children }
    }

    // 从 MenuContextItem 元素提取属性
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
    label?: boolean
    value?: string
  }>,
) {
  return options.filter((option) => !option.divider && !option.label)
}
