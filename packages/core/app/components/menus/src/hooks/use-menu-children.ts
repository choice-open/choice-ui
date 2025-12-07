import React, { Children, isValidElement, useMemo } from "react"

/**
 * 菜单子元素解析 Hook
 *
 * 处理菜单组件的子元素解析逻辑：
 * - 从 children 中提取 trigger 元素
 * - 从 children 中提取 content 元素
 * - 支持 Select 和 Dropdown 的不同子元素类型
 * - 错误处理和警告
 */

export interface MenuChildrenConfig<
  T extends React.ElementType = React.ElementType,
  C extends React.ElementType = React.ElementType,
  S extends React.ElementType = React.ElementType,
> {
  /** Content 组件类型 */
  ContentComponent: C
  /** SubTrigger 组件类型（仅 Dropdown 使用） */
  SubTriggerComponent?: S
  /** Trigger 组件类型 */
  TriggerComponent: T
  /** 子元素 */
  children?: React.ReactNode
  /** 组件类型名称，用于错误提示 */
  componentName: string
}

export interface MenuChildrenResult {
  /** 内容元素 */
  contentElement: React.ReactElement | null
  /** 错误信息 */
  error?: string
  /** 是否有必需的元素 */
  hasRequiredElements: boolean
  /** 子触发器元素（仅 Dropdown 使用） */
  subTriggerElement?: React.ReactElement | null
  /** 触发器元素 */
  triggerElement: React.ReactElement | null
}

export function useMenuChildren<
  T extends React.ElementType = React.ElementType,
  C extends React.ElementType = React.ElementType,
  S extends React.ElementType = React.ElementType,
>(config: MenuChildrenConfig<T, C, S>): MenuChildrenResult {
  const { children, TriggerComponent, ContentComponent, SubTriggerComponent, componentName } =
    config

  // 解析子元素
  const parsedElements = useMemo(() => {
    if (!children) {
      return {
        triggerElement: null,
        contentElement: null,
        subTriggerElement: null,
        hasRequiredElements: false,
        error: `${componentName} requires children`,
      }
    }

    const childrenArray = Children.toArray(children)

    // 查找 trigger 元素
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === TriggerComponent,
    ) as React.ReactElement | null

    // 查找 content 元素
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === ContentComponent,
    ) as React.ReactElement | null

    // 查找 sub-trigger 元素（仅 Dropdown 使用）
    const subTrigger = SubTriggerComponent
      ? (childrenArray.find(
          (child) => isValidElement(child) && child.type === SubTriggerComponent,
        ) as React.ReactElement | null)
      : null

    // 检查必需元素
    const hasRequiredElements = trigger !== null && content !== null

    // 生成错误信息
    let error: string | undefined
    if (!hasRequiredElements) {
      if (!trigger && !content) {
        error = `${componentName} requires both ${componentName}.Trigger and ${componentName}.Content components as children`
      } else if (!trigger) {
        error = `${componentName} requires a ${componentName}.Trigger component as a child`
      } else if (!content) {
        error = `${componentName} requires a ${componentName}.Content component as a child`
      }
    }

    return {
      triggerElement: trigger,
      contentElement: content,
      subTriggerElement: subTrigger,
      hasRequiredElements,
      error,
    }
  }, [children, TriggerComponent, ContentComponent, SubTriggerComponent, componentName])

  // 输出错误信息
  if (parsedElements.error) {
    console.error(parsedElements.error)
  }

  return parsedElements
}
