type DimensionValue = { value: number; unit: string }

export function DimensionInput({
  value,
  onChange,
  step = 0.0625,
}: {
  value: DimensionValue
  onChange: (next: DimensionValue) => void
  step?: number
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={Number.isFinite(value.value) ? value.value : 0}
        step={step}
        onChange={(e) =>
          onChange({ value: parseFloatSafe(e.target.value, 0), unit: value.unit })
        }
        className="w-24 rounded border border-border-default bg-background-default px-2 py-1 text-sm outline-none focus:border-border-strong"
      />
      <span className="text-xs text-text-tertiary">{value.unit}</span>
    </div>
  )
}

export function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number
  onChange: (next: number) => void
  step?: number
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      step={step}
      onChange={(e) => onChange(parseFloatSafe(e.target.value, 0))}
      className="w-24 rounded border border-border-default bg-background-default px-2 py-1 text-sm outline-none focus:border-border-strong"
    />
  )
}

function parseFloatSafe(input: string, fallback: number): number {
  const n = Number.parseFloat(input)
  return Number.isFinite(n) ? n : fallback
}
