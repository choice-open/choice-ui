import * as React from "react"
import { forwardRef, useMemo } from "react"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

interface SlotCloneProps {
  children: React.ReactNode
}

/**
 * Slot component - Lightweight implementation
 *
 * Based on @radix-ui/react-slot design, used for asChild pattern prop forwarding
 * Performance optimization should be done at the consumer level (e.g., useMemo to cache props)
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (React.isValidElement(children)) {
      const childrenRef = getElementRef(children)
      const mergedProps = mergeProps(slotProps, children.props as Record<string, unknown>)

      return React.cloneElement(children, {
        ...mergedProps,
        ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
      } as React.HTMLAttributes<HTMLElement>)
    }

    return <>{children}</>
  },
)

Slot.displayName = "Slot"

/**
 * SlotClone 组件
 */
export const SlotClone = forwardRef<HTMLElement, SlotCloneProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (React.isValidElement(children)) {
      const childrenRef = getElementRef(children)
      const mergedProps = mergeProps(slotProps, children.props as Record<string, unknown>)

      return React.cloneElement(children, {
        ...mergedProps,
        ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
      } as React.HTMLAttributes<HTMLElement>)
    }

    return <>{children}</>
  },
)

SlotClone.displayName = "SlotClone"

/**
 * Props merge function
 * Based on Radix UI implementation
 */
function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  const overrideProps = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          const result = (childPropValue as (...args: unknown[]) => unknown)(...args)
          ;(slotPropValue as (...args: unknown[]) => void)(...args)
          return result
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...(slotPropValue as object), ...(childPropValue as object) }
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ")
    }
  }

  return { ...slotProps, ...overrideProps }
}

/**
 * Ref compose function
 */
function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}

/**
 * Get element ref, compatible with React 18/19
 */
function getElementRef(element: React.ReactElement): React.Ref<unknown> | undefined {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get
  let mayWarn =
    getter && "isReactWarning" in getter && (getter as { isReactWarning?: boolean }).isReactWarning
  if (mayWarn) {
    return (element as unknown as { ref?: React.Ref<unknown> }).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get
  mayWarn =
    getter && "isReactWarning" in getter && (getter as { isReactWarning?: boolean }).isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  return (
    (element.props as { ref?: React.Ref<unknown> }).ref ||
    (element as unknown as { ref?: React.Ref<unknown> }).ref
  )
}

/**
 * Hook version of Slot logic
 */
export function useSlot(
  children: React.ReactNode,
  slotProps: Record<string, unknown>,
  forwardedRef?: React.Ref<unknown>,
) {
  return useMemo(() => {
    if (!React.isValidElement(children)) {
      return children
    }

    const childrenRef = getElementRef(children)
    const mergedProps = mergeProps(slotProps, children.props as Record<string, unknown>)

    return React.cloneElement(children, {
      ...mergedProps,
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
    } as React.HTMLAttributes<HTMLElement>)
  }, [children, slotProps, forwardedRef])
}

/**
 * asChild 模式 Hook
 */
export function useAsChild<T extends React.ElementType = "button">(
  asChild: boolean | undefined,
  defaultElement: T,
): T | typeof Slot {
  return useMemo(() => {
    return asChild ? (Slot as T | typeof Slot) : defaultElement
  }, [asChild, defaultElement])
}
