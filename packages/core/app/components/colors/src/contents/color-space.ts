export const COLOR_SPACES = {
  HEX: "hex",
  RGB: "rgb",
  HSL: "hsl",
  HSB: "hsb",
} as const

export const COLOR_SPACE_OPTIONS = [
  { label: "HEX", value: COLOR_SPACES.HEX },
  { label: "RGB", value: COLOR_SPACES.RGB },
  { label: "HSL", value: COLOR_SPACES.HSL },
  { label: "HSB", value: COLOR_SPACES.HSB },
]
