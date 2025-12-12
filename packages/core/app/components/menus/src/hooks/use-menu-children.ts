import React, { Children, isValidElement, useMemo } from "react"

/**
 * Menu children parsing Hook
 *
 * Handle menu component child element parsing logic:
 * - Extract trigger element from children
 * - Extract content element from children
 * - Support different child element types for Select and Dropdown
 * - Error handling and warnings
 */

export interface MenuChildrenConfig<
  T extends React.ElementType = React.ElementType,
  C extends React.ElementType = React.ElementType,
  S extends React.ElementType = React.ElementType,
> {
  /** Content component type */
  ContentComponent: C
  /** SubTrigger component type (only used for Dropdown) */
  SubTriggerComponent?: S
  /** Trigger component type */
  TriggerComponent: T
  /** Children */
  children?: React.ReactNode
  /** Component type name, for error提示 */
  componentName: string
}

export interface MenuChildrenResult {
  /** Content element */
  contentElement: React.ReactElement | null
  /** Error message */
  error?: string
  /** Whether there are required elements */
  hasRequiredElements: boolean
  /** Sub-trigger element (only used for Dropdown) */
  subTriggerElement?: React.ReactElement | null
  /** Trigger element */
  triggerElement: React.ReactElement | null
}

export function useMenuChildren<
  T extends React.ElementType = React.ElementType,
  C extends React.ElementType = React.ElementType,
  S extends React.ElementType = React.ElementType,
>(config: MenuChildrenConfig<T, C, S>): MenuChildrenResult {
  const { children, TriggerComponent, ContentComponent, SubTriggerComponent, componentName } =
    config

  // Parse children elements
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

    // Find trigger element
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === TriggerComponent,
    ) as React.ReactElement | null

    // Find content element
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === ContentComponent,
    ) as React.ReactElement | null

    // Find sub-trigger element (only used for Dropdown)
    const subTrigger = SubTriggerComponent
      ? (childrenArray.find(
          (child) => isValidElement(child) && child.type === SubTriggerComponent,
        ) as React.ReactElement | null)
      : null

    // Check required elements
    const hasRequiredElements = trigger !== null && content !== null

    // Generate error message
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

  // Output error message
  if (parsedElements.error) {
    console.error(parsedElements.error)
  }

  return parsedElements
}
