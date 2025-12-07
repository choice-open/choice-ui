import React from "react"
import { isBrowser } from "./utils"
import { useIsomorphicLayoutEffect } from "usehooks-ts"

// 简化的 useLatest hook
function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value)
  ref.current = value
  return ref
}

// 简化的 useComposedRef hook
export function useComposedRef<T>(
  libRef: React.MutableRefObject<T | null>,
  userRef: React.Ref<T>,
): React.RefCallback<T> {
  return React.useCallback(
    (node: T) => {
      libRef.current = node
      if (typeof userRef === "function") {
        userRef(node)
      } else if (userRef) {
        const ref = userRef as React.MutableRefObject<T | null>
        ref.current = node
      }
    },
    [libRef, userRef],
  )
}

type UnknownFunction = (...args: unknown[]) => unknown

type InferEventType<TTarget> = TTarget extends {
  addEventListener(type: infer P, ...args: unknown[]): void
  addEventListener(type: infer P2, ...args: unknown[]): void
}
  ? P & string
  : never

type InferEvent<TTarget, TType extends string> = `on${TType}` extends keyof TTarget
  ? Parameters<Extract<TTarget[`on${TType}`], UnknownFunction>>[0]
  : Event

function useListener<TTarget extends EventTarget, TType extends InferEventType<TTarget>>(
  target: TTarget | null,
  type: TType,
  listener: (event: InferEvent<TTarget, TType>) => void,
) {
  const latestListener = useLatest(listener)

  useIsomorphicLayoutEffect(() => {
    // SSR 保护
    if (!isBrowser || !target) {
      return
    }

    const handler: typeof listener = (ev) => latestListener.current(ev)

    try {
      target.addEventListener(type, handler)
      return () => {
        try {
          target.removeEventListener(type, handler)
        } catch (error) {
          // 静默处理清理错误，可能目标已被销毁
        }
      }
    } catch (error) {
      // 静默处理错误
      return
    }
  }, [target, type, latestListener])
}

export const useFormResetListener = (
  libRef: React.MutableRefObject<HTMLTextAreaElement | null>,
  listener: (event: Event) => void,
) => {
  const stableListener = React.useCallback(
    (ev: Event) => {
      if (libRef.current?.form === ev.target) {
        listener(ev)
      }
    },
    [libRef, listener],
  )

  useListener(isBrowser ? document.body : null, "reset" as never, stableListener)
}

export const useWindowResizeListener = (listener: (event: UIEvent) => void) => {
  useListener(isBrowser ? window : null, "resize" as never, listener)
}

export const useFontsLoadedListener = (listener: (event: Event) => void) => {
  const safeListener = React.useCallback(
    (event: Event) => {
      try {
        listener(event)
      } catch (error) {
        // 静默处理错误
      }
    },
    [listener],
  )

  useListener(
    isBrowser && document.fonts ? document.fonts : null,
    "loadingdone" as never,
    safeListener,
  )
}
