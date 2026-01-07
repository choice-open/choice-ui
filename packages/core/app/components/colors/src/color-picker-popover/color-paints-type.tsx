import { IconButton } from "@choice-ui/icon-button"
import {
  ColorTypeGradient,
  ColorTypeImage,
  ColorTypePattern,
  ColorTypeSolid,
} from "@choiceform/icons-react"
import { memo, useMemo } from "react"
import { translation } from "../contents"
import type { Paint, PaintTypeLabels } from "../types"

// 类型定义
type PaintType = Extract<
  Paint["type"],
  "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "IMAGE" | "PATTERN"
>

interface PaintTypeConfig {
  featureKey: "solid" | "gradient" | "pattern" | "image"
  icon: React.ReactNode
  label: string
  value: PaintType
}

interface ColorPaintsTypeProps {
  className?: string
  features: {
    gradient?: boolean
    image?: boolean
    pattern?: boolean
    solid?: boolean
  }
  labels?: Omit<PaintTypeLabels, "colorContrast">
  onChange?: (value: Paint["type"]) => void
  value?: Paint["type"]
}

export const ColorPaintsType = memo((props: ColorPaintsTypeProps) => {
  const { value, onChange, features, labels } = props

  // 标准化渐变类型
  const normalizedValue = useMemo(() => {
    return value?.startsWith("GRADIENT") ? "GRADIENT_LINEAR" : value
  }, [value])

  // 配置
  const paintTypeConfig: PaintTypeConfig[] = useMemo(() => {
    return [
      {
        value: "SOLID",
        icon: <ColorTypeSolid />,
        label: labels?.solid ?? translation.type.SOLID,
        featureKey: "solid",
      },
      {
        value: "GRADIENT_LINEAR",
        icon: <ColorTypeGradient />,
        label: labels?.gradient ?? translation.type.GRADIENT,
        featureKey: "gradient",
      },
      {
        value: "PATTERN",
        icon: <ColorTypePattern />,
        label: labels?.pattern ?? translation.type.PATTERN,
        featureKey: "pattern",
      },
      {
        value: "IMAGE",
        icon: <ColorTypeImage />,
        label: labels?.image ?? translation.type.IMAGE,
        featureKey: "image",
      },
    ]
  }, [labels?.gradient, labels?.image, labels?.pattern, labels?.solid])

  // 过滤可用的类型
  const availableTypes = useMemo(() => {
    return paintTypeConfig.filter((type) => features[type.featureKey])
  }, [features, paintTypeConfig])

  return (
    <div className="flex flex-1 items-center gap-1">
      {availableTypes.map((type) => (
        <IconButton
          key={type.value}
          tooltip={{ content: type.label }}
          active={normalizedValue === type.value}
          onClick={() => onChange?.(type.value)}
        >
          {type.icon}
        </IconButton>
      ))}
    </div>
  )
})

ColorPaintsType.displayName = "ColorPaintsType"
