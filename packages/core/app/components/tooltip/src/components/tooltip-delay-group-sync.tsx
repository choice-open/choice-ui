import { useDelayGroup } from "@floating-ui/react"
import { useLayoutEffect } from "react"
import { useTooltipState } from "../context/tooltip-context"
import { useTooltipDelay } from "../context/tooltip-delay-context"

/**
 * Invisible subscriber that bridges FloatingDelayGroup's volatile state into
 * the tooltip's mutable `_delayRef`.
 *
 * Why it exists: useTooltip intentionally does NOT subscribe to
 * FloatingDelayGroupContext, otherwise every tooltip in the tree would
 * re-render its full subtree on any hover. This component is the single
 * subscription point — it runs the useDelayGroup hook (which performs the
 * group's open/close coordination side effects), mirrors the dynamic group
 * delay into the shared `_delayRef`, and renders nothing.
 *
 * useHover holds the same ref'd object via useLatestRef, so when one tooltip
 * opens and the group flips its delay to `{ open: 1, close: ... }`, the next
 * tooltip's useHover sees the new value at hover time without needing
 * useTooltip to re-render.
 */
export function TooltipDelayGroupSync() {
  const state = useTooltipState()
  const staticDelay = useTooltipDelay()
  const groupCtx = useDelayGroup(state.context, {
    id: state.context.floatingId,
  })

  const groupDelay = groupCtx.delay

  useLayoutEffect(() => {
    const target = state._delayRef.current
    const baseOpen =
      typeof staticDelay === "number" ? staticDelay : (staticDelay.open ?? 0)
    const baseClose =
      typeof staticDelay === "number" ? staticDelay : (staticDelay.close ?? 0)

    // FloatingDelayGroup's default context (no provider) reports delay=0.
    // In that case fall back to the user's static delay so behavior matches
    // a plain non-grouped tooltip.
    if (
      groupDelay === 0 ||
      (typeof groupDelay === "object" && groupDelay.open == null && groupDelay.close == null)
    ) {
      target.open = baseOpen
      target.close = baseClose
      return
    }

    if (typeof groupDelay === "number") {
      target.open = groupDelay
      target.close = groupDelay
    } else {
      target.open = groupDelay.open ?? baseOpen
      target.close = groupDelay.close ?? baseClose
    }
  }, [groupDelay, staticDelay, state._delayRef])

  return null
}
