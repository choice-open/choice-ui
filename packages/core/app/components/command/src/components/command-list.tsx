import { tcx } from "@choiceform/design-shared"
import { ScrollArea, type ScrollAreaProps } from "@choiceform/scroll-area"
import { forwardRef, useEffect, useRef } from "react"
import { useCommand, useCommandState } from "../hooks"
import { commandListTv } from "../tv"

export interface CommandListProps extends ScrollAreaProps {
  children: React.ReactNode
  className?: string
  label?: string
}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>((props, forwardedRef) => {
  const { children, className, label = "Suggestions", hoverBoundary = "none", ...rest } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const height = useRef<HTMLDivElement | null>(null)
  const selectedItemId = useCommandState((state) => state.selectedItemId)
  const context = useCommand()

  useEffect(() => {
    if (height.current && ref.current) {
      const el = height.current
      const wrapper = ref.current
      let animationFrame: number
      const observer = new ResizeObserver(() => {
        animationFrame = requestAnimationFrame(() => {
          const height = el.offsetHeight
          wrapper.style.setProperty(`--cmdk-list-height`, height.toFixed(1) + "px")
        })
      })
      observer.observe(el)
      return () => {
        cancelAnimationFrame(animationFrame)
        observer.unobserve(el)
      }
    }
  }, [])

  const tv = commandListTv()

  return (
    <ScrollArea
      variant={context.variant}
      hoverBoundary={hoverBoundary}
      {...rest}
    >
      <ScrollArea.Viewport
        ref={(el) => {
          ref.current = el
          if (typeof forwardedRef === "function") forwardedRef(el)
          else if (forwardedRef) forwardedRef.current = el
        }}
        {...rest}
        className={tcx(tv.root({ className }))}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={selectedItemId}
        aria-label={label}
        id={context.listId}
      >
        <ScrollArea.Content
          className={tcx(tv.content())}
          ref={(el) => {
            height.current = el
            if (context.listInnerRef) {
              context.listInnerRef.current = el
            }
          }}
        >
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  )
})

CommandList.displayName = "CommandList"
