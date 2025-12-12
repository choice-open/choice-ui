import React, { forwardRef, useMemo } from "react"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

interface SlotCloneProps {
  children: React.ReactNode
}

/**
 * Optimized Slot component implementation
 *
 * Compared to performance optimization of @radix-ui/react-slot:
 * 1. Use useMemo to cache children processing results
 * 2. Simplify props merging logic
 * 3. Avoid unnecessary deep traversal
 * 4. Better type safety
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    // Use useMemo to cache processing results, avoid recalculating on each render
    const slottedChild = useMemo(() => {
      if (!React.isValidElement(children)) {
        return children
      }

      // React 19: element.ref is deprecated/removed; ref is treated as a normal prop.
      // Prefer reading ref from children.props to avoid accessing element.ref.
      const childProps = (children as React.ReactElement<Record<string, unknown>>).props
      const childRef = (childProps as { ref?: React.Ref<unknown> }).ref
      const mergedProps = mergeProps(slotProps, children.props)

      return React.cloneElement(children, {
        ...mergedProps,
        ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
      } as React.HTMLAttributes<HTMLElement>)
    }, [children, slotProps, forwardedRef])

    return <>{slottedChild}</>
  },
)

Slot.displayName = "Slot"

/**
 * SlotClone component - used for deep cloning
 * When nested structures need to be processed
 */
export const SlotClone = forwardRef<HTMLElement, SlotCloneProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const slottedChild = useMemo(() => {
      if (!React.isValidElement(children)) {
        return children
      }

      // React 19: element.ref is deprecated/removed; ref is treated as a normal prop.
      const childProps = (children as React.ReactElement<Record<string, unknown>>).props
      const childRef = (childProps as { ref?: React.Ref<unknown> }).ref
      const mergedProps = mergeProps(slotProps, children.props)

      return React.cloneElement(children, {
        ...mergedProps,
        ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
      } as React.HTMLAttributes<HTMLElement>)
    }, [children, slotProps, forwardedRef])

    return <>{slottedChild}</>
  },
)

SlotClone.displayName = "SlotClone"

/**
 * Optimized props merging function
 * Specifically handles event handlers and className merging
 */
function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  const overrideProps = { ...childProps }

  // Merge className
  if (slotProps.className && childProps.className) {
    overrideProps.className = `${slotProps.className} ${childProps.className}`
  } else if (slotProps.className) {
    overrideProps.className = slotProps.className
  }

  // Merge style
  if (slotProps.style && childProps.style) {
    overrideProps.style = { ...slotProps.style, ...childProps.style }
  } else if (slotProps.style) {
    overrideProps.style = slotProps.style
  }

  // Merge event handlers
  for (const propName in slotProps) {
    if (propName.startsWith("on") && typeof slotProps[propName] === "function") {
      const slotHandler = slotProps[propName] as (...args: unknown[]) => void
      const childHandler = childProps[propName] as (...args: unknown[]) => void

      if (childHandler && typeof childHandler === "function") {
        overrideProps[propName] = (...args: unknown[]) => {
          childHandler(...args)
          slotHandler(...args)
        }
      } else {
        overrideProps[propName] = slotHandler
      }
    } else if (propName !== "className" && propName !== "style") {
      overrideProps[propName] = slotProps[propName]
    }
  }

  return overrideProps
}

/**
 * Optimized ref merging function
 * Supports function refs and object refs
 */
function composeRefs(...refs: Array<React.Ref<unknown> | undefined>) {
  return (node: unknown) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref != null) {
        const mutableRef = ref as React.MutableRefObject<unknown>
        mutableRef.current = node
      }
    })
  }
}

/**
 * Hook version of Slot logic
 * Used for scenarios that require more granular control
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

    // React 19: element.ref is deprecated/removed; ref is treated as a normal prop.
    const childProps = (children as React.ReactElement<Record<string, unknown>>).props
    const childRef = (childProps as { ref?: React.Ref<unknown> }).ref
    const mergedProps = mergeProps(slotProps, children.props)

    return React.cloneElement(children, {
      ...mergedProps,
      ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
    } as React.HTMLAttributes<HTMLElement>)
  }, [children, slotProps, forwardedRef])
}

/**
 * Performance optimized asChild mode Hook
 * Used to replace `const Component = asChild ? Slot : "button"` mode
 */
export function useAsChild<T extends React.ElementType = "button">(
  asChild: boolean | undefined,
  defaultElement: T,
): T | typeof Slot {
  return useMemo(() => {
    return asChild ? (Slot as T | typeof Slot) : defaultElement
  }, [asChild, defaultElement])
}
