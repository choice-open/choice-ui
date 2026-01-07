import { IconButton } from "@choice-ui/icon-button"
import { Select } from "@choice-ui/select"
import { Rotate90Right, SwapHorizontalSmall } from "@choiceform/icons-react"
import { useMemo } from "react"
import { translation } from "../contents"
import type { GradientPaint, GradientToolbarLabels } from "../types/paint"

interface ColorGradientsToolbarProps {
  labels?: GradientToolbarLabels
  onFlipStops: () => void
  onRotate: () => void
  onTypeChange: (value: string) => void
  type: GradientPaint["type"]
}

export const ColorGradientsToolbar = function ColorGradientsToolbar(
  props: ColorGradientsToolbarProps,
) {
  const { type, onTypeChange, onRotate, onFlipStops, labels } = props

  const GRADIENTS_TYPES = useMemo(() => {
    return [
      { value: "GRADIENT_LINEAR", label: labels?.linear ?? translation.gradients.LINEAR },
      { value: "GRADIENT_RADIAL", label: labels?.radial ?? translation.gradients.RADIAL },
      { value: "GRADIENT_ANGULAR", label: labels?.conic ?? translation.gradients.CONIC },
    ]
  }, [labels?.conic, labels?.linear, labels?.radial])

  return (
    <div className="grid h-12 grid-cols-2 items-center gap-2 pr-2 pl-4">
      <Select
        value={type}
        onChange={onTypeChange}
      >
        <Select.Trigger>
          <span className="flex-1 truncate">
            {GRADIENTS_TYPES.find((option) => option.value === type)?.label}
          </span>
        </Select.Trigger>
        <Select.Content className="min-w-28">
          {GRADIENTS_TYPES.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <div className="flex flex-1 items-center justify-end">
        <IconButton
          tooltip={{
            content: labels?.rotateGradient ?? translation.gradients.ROTATE_GRADIENT,
          }}
          onClick={onRotate}
        >
          <Rotate90Right />
        </IconButton>
        <IconButton
          tooltip={{
            content: labels?.flipGradient ?? translation.gradients.FLIP_GRADIENT,
          }}
          onClick={onFlipStops}
        >
          <SwapHorizontalSmall />
        </IconButton>
      </div>
    </div>
  )
}
