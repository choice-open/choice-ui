import { Children, isValidElement, Fragment, type ReactElement, type ReactNode } from "react"

type SlotMarker = { displayName?: string }

const REACT_MEMO_TYPE = Symbol.for("react.memo")

/**
 * Peel React.memo wrappers off an element type so a re-memoized slot still
 * matches the original component identity. `React.memo(Slot)` returns a new
 * object whose `.type` points at the inner component — recurse until we hit
 * something that isn't a memo wrapper.
 */
function unwrapMemo(type: unknown): unknown {
  let current = type
  while (
    typeof current === "object" &&
    current !== null &&
    (current as { $$typeof?: symbol }).$$typeof === REACT_MEMO_TYPE
  ) {
    current = (current as { type?: unknown }).type
  }
  return current
}

/**
 * Match a child against a target slot component.
 *
 * Handles:
 * - Direct identity: `child.type === Slot`
 * - Re-memoized slots: peel `React.memo` wrappers until we hit the inner type
 * - displayName fallback: covers custom wrappers and user-supplied memo's that
 *   preserve `displayName`
 *
 * Returns a plain boolean (not a type predicate) so it can be used to pick
 * between sibling slots without over-narrowing the else branch to `never`,
 * which would prevent the next `isSlotChild(child, OtherSlot)` from
 * typechecking.
 */
export function isSlotChild(child: ReactNode, slot: SlotMarker): boolean {
  if (!isValidElement(child)) return false
  const type = child.type as SlotMarker
  if (type === slot) return true
  // Unwrap both sides so a re-memoized child still matches a memo'd slot.
  // (Most slots in this lib are already `memo(forwardRef(...))`; consumers
  // can wrap them in another memo without losing identity.)
  if (unwrapMemo(type) === unwrapMemo(slot)) return true
  return Boolean(slot.displayName && type.displayName === slot.displayName)
}

/**
 * Recursively find the first child matching `slot`.
 *
 * Descends only through "transparent" wrappers — Fragments and plain DOM
 * elements (string types like "div", "span") — so users can write
 * `<><Select.Trigger /></>` or `<div><Select.Trigger /></div>` without the
 * parent silently failing.
 *
 * Crucially, recursion stops at component boundaries: the outer `Dropdown`
 * must not bind to a `Trigger` that lives inside an inner `Dropdown` rendered
 * within `Content`. Walking through arbitrary components would let nested
 * structures leak slots upward.
 *
 * Stops at the first match — for unique slots like Trigger / Content.
 */
export function findSlotChild(
  children: ReactNode,
  slot: SlotMarker,
): ReactElement | undefined {
  const arr = Children.toArray(children)
  for (const child of arr) {
    if (!isValidElement(child)) continue
    if (isSlotChild(child, slot)) return child

    // Only descend through Fragments and host (DOM) elements. Anything else
    // is a component boundary whose children belong to that component, not
    // to us — recursing past it would mis-attach to nested same-type slots.
    const isHostElement = typeof child.type === "string"
    const isFragment = child.type === Fragment
    if (!isHostElement && !isFragment) continue

    const nested = findSlotChild(
      (child.props as { children?: ReactNode }).children,
      slot,
    )
    if (nested) return nested
  }
  return undefined
}

/**
 * Flatten children, unwrapping Fragments so callers see a flat list of
 * elements regardless of how the user grouped them.
 *
 * Use this for slots that appear multiple times (Items, Dividers) where the
 * caller wants to filter by type without descending past Fragments.
 */
export function flattenSlotChildren(children: ReactNode): ReactElement[] {
  const result: ReactElement[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    if (child.type === Fragment) {
      const fragmentChildren = (child.props as { children?: ReactNode }).children
      result.push(...flattenSlotChildren(fragmentChildren))
    } else {
      result.push(child)
    }
  })
  return result
}
