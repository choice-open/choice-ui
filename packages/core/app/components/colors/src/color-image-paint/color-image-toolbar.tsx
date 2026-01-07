import { IconButton } from "@choice-ui/icon-button"
import { Select } from "@choice-ui/select"
import { useMergedValue } from "@choice-ui/shared"
import { Rotate90Right } from "@choiceform/icons-react"
import { memo } from "react"
import type { ImagePaintFeature, ImageScaleMode } from "../types"
import { ColorImageToolbarTv } from "./tv"

interface ColorImageToolbarProps {
  features?: ImagePaintFeature
  onRotate?: () => void
  onScaleModeChange?: (scaleMode: ImageScaleMode) => void
  scaleMode?: ImageScaleMode
}

export const ColorImageToolbar = memo(function ColorImageToolbar(props: ColorImageToolbarProps) {
  const { features, scaleMode, onScaleModeChange, onRotate } = props

  const styles = ColorImageToolbarTv()

  const [internalScaleMode, setInternalScaleMode] = useMergedValue<ImageScaleMode>({
    defaultValue: "FILL",
    value: scaleMode,
    onChange: (value) => {
      onScaleModeChange?.(value)
    },
  })

  return (
    <div className={styles.root()}>
      <Select
        value={internalScaleMode}
        onChange={(value) => {
          setInternalScaleMode(value as ImageScaleMode)
        }}
      >
        <Select.Trigger>
          <Select.Value>
            {features?.labels?.[internalScaleMode.toLowerCase() as keyof typeof features.labels]}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="FILL">{features?.labels?.fill}</Select.Item>
          <Select.Item value="FIT">{features?.labels?.fit}</Select.Item>
          <Select.Item value="CROP">{features?.labels?.crop}</Select.Item>
          <Select.Item value="TILE">{features?.labels?.tile}</Select.Item>
        </Select.Content>
      </Select>

      <div className={styles.right()}>
        <IconButton
          tooltip={{
            content: features?.labels?.rotate,
          }}
          onClick={onRotate}
        >
          <Rotate90Right />
        </IconButton>
      </div>
    </div>
  )
})
