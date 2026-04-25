import type { W3CColorValue } from "../lib/w3c"

type Props = {
  value: W3CColorValue | null
  isAlias: boolean
  size?: number
  onClick?: () => void
}

export function ColorSwatchButton({ value, isAlias, size = 32, onClick }: Props) {
  const css = value ? srgbToCss(value) : "transparent"
  return (
    <button
      type="button"
      onClick={onClick}
      title={isAlias ? "Aliased — edit not supported in v0.1" : value?.hex ?? ""}
      className="rounded border border-border-default shadow-sm transition disabled:cursor-not-allowed"
      style={{
        width: size,
        height: size,
        background: css,
        backgroundImage: !value
          ? "repeating-conic-gradient(#ddd 0 25%, transparent 0 50%) 50%/8px 8px"
          : undefined,
      }}
      disabled={isAlias}
    />
  )
}

function srgbToCss(value: W3CColorValue): string {
  const [r, g, b] = value.components
  const a = value.alpha ?? 1
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`
}
