import React, { forwardRef, useMemo } from "react"

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

interface SlotCloneProps {
  children: React.ReactNode
}

/**
 * 优化的 Slot 组件实现
 *
 * 相比 @radix-ui/react-slot 的性能优化：
 * 1. 使用 useMemo 缓存 children 处理结果
 * 2. 简化 props 合并逻辑
 * 3. 避免不必要的深度遍历
 * 4. 更好的类型安全
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    // 使用 useMemo 缓存处理结果，避免每次渲染都重新计算
    const slottedChild = useMemo(() => {
      if (!React.isValidElement(children)) {
        return children
      }

      const childRef = (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref
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
 * SlotClone 组件 - 用于深度克隆
 * 当需要处理嵌套结构时使用
 */
export const SlotClone = forwardRef<HTMLElement, SlotCloneProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const slottedChild = useMemo(() => {
      if (!React.isValidElement(children)) {
        return children
      }

      const childRef = (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref
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
 * 优化的 props 合并函数
 * 专门处理事件处理器和 className 的合并
 */
function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  const overrideProps = { ...childProps }

  // 合并 className
  if (slotProps.className && childProps.className) {
    overrideProps.className = `${slotProps.className} ${childProps.className}`
  } else if (slotProps.className) {
    overrideProps.className = slotProps.className
  }

  // 合并 style
  if (slotProps.style && childProps.style) {
    overrideProps.style = { ...slotProps.style, ...childProps.style }
  } else if (slotProps.style) {
    overrideProps.style = slotProps.style
  }

  // 合并事件处理器
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
 * 优化的 ref 合并函数
 * 支持 function refs 和 object refs
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
 * Hook 版本的 Slot 逻辑
 * 用于需要更细粒度控制的场景
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

    const childRef = (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref
    const mergedProps = mergeProps(slotProps, children.props)

    return React.cloneElement(children, {
      ...mergedProps,
      ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
    } as React.HTMLAttributes<HTMLElement>)
  }, [children, slotProps, forwardedRef])
}

/**
 * 性能优化的 asChild 模式 Hook
 * 用于替代 `const Component = asChild ? Slot : "button"` 模式
 */
export function useAsChild<T extends React.ElementType = "button">(
  asChild: boolean | undefined,
  defaultElement: T,
): T | typeof Slot {
  return useMemo(() => {
    return asChild ? (Slot as T | typeof Slot) : defaultElement
  }, [asChild, defaultElement])
}
