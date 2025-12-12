import { tcx } from "@choice-ui/shared"
import React, { forwardRef, HTMLProps, memo, useEffect, useId, useMemo, useRef } from "react"
import { GroupContext, useCommand, useCommandState, useValue } from "../hooks"
import { commandGroupTv } from "../tv"

export interface CommandGroupProps extends HTMLProps<HTMLDivElement> {
  /**
   * Whether to force mount the group.
   * @default false
   */
  forceMount?: boolean
  /**
   * The heading of the group.
   */
  heading?: React.ReactNode
  /**
   * The value of the group.
   */
  value?: string
  /**
   * Whether the group is hidden.
   * @default false
   */
  hidden?: boolean
}

export const CommandGroup = memo(
  forwardRef<HTMLDivElement, CommandGroupProps>((props, forwardedRef) => {
    const { className, heading, children, forceMount, value, ...rest } = props
    const id = useId()
    const ref = useRef<HTMLDivElement | null>(null)
    const headingRef = useRef<HTMLDivElement | null>(null)
    const headingId = React.useId()
    const context = useCommand()

    const render = useCommandState((state) =>
      forceMount
        ? true
        : context.filter() === false
          ? true
          : !state.search
            ? true
            : state.filtered.groups.has(id),
    )

    // Register group
    useEffect(() => {
      return context.group(id)
    }, [context, id])

    const valueDeps = useMemo(() => [value, heading, headingRef], [value, heading])
    useValue(id, ref, valueDeps)

    const contextValue = useMemo(() => ({ id, forceMount }), [id, forceMount])

    const tv = commandGroupTv({ variant: context.variant, hidden: !render })

    // Use CSS to hide instead of returning null, keeping group and its items always registered
    // This allows correct re-filtering when search query changes
    return (
      <div
        ref={(el) => {
          ref.current = el
          if (typeof forwardedRef === "function") forwardedRef(el)
          else if (forwardedRef) forwardedRef.current = el
        }}
        {...rest}
        className={tv.root({ className })}
        role="presentation"
        data-value={value}
        data-hidden={!render || undefined}
      >
        {heading && (
          <div
            ref={headingRef}
            className={tcx(tv.heading())}
            aria-hidden
            id={headingId}
          >
            {heading}
          </div>
        )}
        <div
          role="group"
          aria-labelledby={heading ? headingId : undefined}
        >
          <GroupContext.Provider value={contextValue}>{children}</GroupContext.Provider>
        </div>
      </div>
    )
  }),
)

CommandGroup.displayName = "CommandGroup"
