/**
 * Tiny visual badges shown on the right edge of each sidebar preset row.
 * Driven by the live `--cdt-*` CSS variables so they reflect the current
 * editor state (and the Customize edits, via `<style id="cdt-live">`).
 */

export function ColorsIndicator() {
  return (
    <div className="flex gap-0.5">
      <Dot color="rgb(var(--cdt-color-blue-500))" />
      <Dot color="rgb(var(--cdt-color-pink-500))" />
      <Dot color="rgb(var(--cdt-color-neutrals-500))" />
    </div>
  )
}

export function TypographyIndicator() {
  return (
    <span className="font-serif text-sm leading-none text-text-default" aria-hidden>
      Aa
    </span>
  )
}

export function SpacingIndicator() {
  return (
    <div className="flex items-end gap-0.5">
      {[6, 9, 12].map((h) => (
        <span key={h} className="w-0.5 bg-text-default" style={{ height: h }} />
      ))}
    </div>
  )
}

export function ShadowsIndicator() {
  return (
    <span
      className="block h-3 w-3 rounded-sm bg-background-default"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.18), 0 0.5px 0 rgba(0,0,0,0.05)" }}
    />
  )
}

export function RadiusIndicator() {
  return (
    <span
      aria-hidden
      className="block h-3 w-3 border border-text-default"
      style={{ borderTopLeftRadius: "5px" }}
    />
  )
}

export function BreakpointsIndicator() {
  return (
    <div className="flex flex-col items-end gap-0.5">
      {[10, 7, 4].map((w) => (
        <span key={w} className="h-0.5 bg-text-default" style={{ width: w }} />
      ))}
    </div>
  )
}

export function ZIndexIndicator() {
  return (
    <div className="relative h-3 w-4">
      <span className="absolute inset-x-0 top-0 h-1.5 w-3 border border-text-default bg-background-default" />
      <span className="absolute inset-x-0 bottom-0 right-0 left-1 h-1.5 w-3 border border-text-default bg-background-component" />
    </div>
  )
}

function Dot({ color }: { color: string }) {
  return <span className="h-2 w-2 rounded-full" style={{ background: color }} />
}
