import { tcx } from "@choiceform/design-shared"
import { NumericInput } from "@choiceform/numeric-input"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useCallback, useMemo, useState } from "react"
import { BezierCurveEditor } from "../src/bezier-curve-editor"
import { LinearGradient } from "../src/components/linear-gradient"
import { BEZIER_CURVE_EDITOR_DEFAULTS, PRESET_EASINGS, PREVIEW_KEYFRAMES } from "../src/constants"
import { BezierCurveExpandedValueType, BezierCurveValueType } from "../src/types"

// 生成表示贝塞尔曲线运动速率的渐变色
function generateSpeedGradient(value: BezierCurveValueType): string {
  const [x1, y1, x2, y2] = value

  // 计算曲线在不同时间点的速率
  const colors: string[] = []
  const steps = 20

  for (let i = 0; i <= steps; i++) {
    const t = i / steps

    // 贝塞尔曲线的导数（速度向量）
    const dx = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2)

    // 速度大小（只关注 x 轴速度）
    const speed = Math.abs(dx)

    // 简化的速度映射
    const normalizedSpeed = Math.min(Math.max(speed, 0), 2) / 2

    let color
    if (normalizedSpeed < 0.33) {
      // 慢速：蓝色到青色
      const factor = normalizedSpeed / 0.33
      const r = Math.round(59 + factor * 20)
      const g = Math.round(130 + factor * 50)
      const b = 246
      color = `rgb(${r}, ${g}, ${b})`
    } else if (normalizedSpeed < 0.66) {
      // 中速：青色到绿色
      const factor = (normalizedSpeed - 0.33) / 0.33
      const r = Math.round(79 - factor * 45)
      const g = Math.round(180 + factor * 17)
      const b = Math.round(246 - factor * 152)
      color = `rgb(${r}, ${g}, ${b})`
    } else {
      // 快速：绿色到红色
      const factor = (normalizedSpeed - 0.66) / 0.34
      const r = Math.round(34 + factor * 205)
      const g = Math.round(197 - factor * 129)
      const b = Math.round(94 - factor * 26)
      color = `rgb(${r}, ${g}, ${b})`
    }

    colors.push(`${color} ${(t * 100).toFixed(1)}%`)
  }

  return `linear-gradient(to right, ${colors.join(", ")})`
}

const meta: Meta<typeof BezierCurveEditor> = {
  title: "Utilities/BezierCurveEditor",
  component: BezierCurveEditor,
  decorators: [
    (Story) => (
      <>
        <LinearGradient />
        <Story />
      </>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof BezierCurveEditor>

/**
 * To use the component in the basic way, pass an array with four numbers between 0 and 1 inclusive to the `value` prop.
 * The same format will be passed to the change handler that you provide when the value changes.
 *
 * _Note: If you are using TypeScript, you may need to set the `allowNodeEditing` prop to `false`_
 */
export const Basic: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<BezierCurveValueType>(
      BEZIER_CURVE_EDITOR_DEFAULTS.defaultValue,
    )

    const delay = 0
    const duration = 2

    const previewAnimationStyle = useMemo(
      () => ({
        animationName: "bezier-preview-loop",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animationTimingFunction: `cubic-bezier(${value})`,
      }),
      [delay, duration, value],
    )

    return (
      <div className="flex flex-col gap-4">
        <style>{PREVIEW_KEYFRAMES(208 - 24 - 8).bezierLoop}</style>
        <div className="flex aspect-square w-52 items-center justify-center rounded-md border">
          <BezierCurveEditor
            size={96}
            allowNodeEditing={false}
            value={value}
            onChange={setValue}
            className="absolute"
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <p className="flex-1">Bezier</p>
          <NumericInput
            className="w-full"
            value={value}
            expression="{v1},{v2},{v3},{v4}"
            onChange={(_val, detail) => {
              setValue(detail.array.slice(0, 4) as BezierCurveValueType)
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-secondary-background relative h-8 w-full rounded-lg">
            <div
              className="absolute top-1 left-1 size-6 rounded-md bg-white shadow-xs"
              style={previewAnimationStyle}
            />
          </div>
          <div className="text-default-foreground/70 flex items-center gap-2 text-xs">
            <span>Speed:</span>
            <span className="text-blue-600">●</span>
            <span>Slow</span>
            <span className="text-green-600">●</span>
            <span>Medium</span>
            <span className="text-red-600">●</span>
            <span>Fast</span>
          </div>
          <div
            className="h-1 w-full rounded-md"
            style={{
              backgroundImage: generateSpeedGradient(value),
            }}
          />
        </div>
      </div>
    )
  },
}

/**
 * To use the component in the advanced way, you must set the `allowNodeEditing` prop to `true`.
 * An array with 8 numbers between 0 and 1 inclusive will be used for the value and will be passed to your change handler.
 *
 * _Note: By default, all of the values are editable. Scroll down to see examples that constrain axes._
 */
export const AdvancedBothAxes: Story = {
  name: "Advanced",
  render: function Render(args) {
    const [value, setValue] = useState<BezierCurveExpandedValueType>([
      0, 0, 0.5, 0.25, 0.5, 0.75, 1, 1,
    ])
    return (
      <div className="flex flex-col gap-4">
        <div className="flex aspect-square w-80 items-center justify-center rounded-xl border">
          <BezierCurveEditor
            size={200}
            value={value}
            onChange={setValue}
            allowNodeEditing
            handleSize={12}
            className="absolute"
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <p className="flex-1">Bezier</p>
          <NumericInput
            className="w-full"
            value={value}
            expression="{v1},{v2},{v3},{v4},{v5},{v6},{v7},{v8}"
            onChange={(_val, detail) => {
              setValue(detail.array.slice(0, 8) as BezierCurveExpandedValueType)
            }}
          />
        </div>
      </div>
    )
  },
}

export const PresetEasings: Story = {
  render: function Render() {
    const [isHovered, setIsHovered] = useState<number | null>(null)
    const [selectedValue, setSelectedValue] = useState<{
      name: string
      value: BezierCurveValueType
    }>(PRESET_EASINGS[0])

    const [duration, setDuration] = useState(BEZIER_CURVE_EDITOR_DEFAULTS.duration)
    const [delay, setDelay] = useState(BEZIER_CURVE_EDITOR_DEFAULTS.delay)

    // 缓存预览动画样式
    const previewAnimationStyle = useMemo(
      () => ({
        animationName: "bezier-preview-loop",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animationTimingFunction: `cubic-bezier(${selectedValue.value})`,
      }),
      [delay, duration, selectedValue.value],
    )

    // 缓存主要变更处理器
    const handleValueChange = useCallback((value: BezierCurveValueType) => {
      setSelectedValue({
        name: `cubic-bezier(${value.map((v) => v.toFixed(2)).join(", ")})`,
        value,
      })
    }, [])

    // 缓存预设项点击处理器
    const handlePresetClick = useCallback((item: { name: string; value: BezierCurveValueType }) => {
      setSelectedValue(item)
    }, [])

    return (
      <div className="flex items-stretch gap-8">
        <style>{PREVIEW_KEYFRAMES(160 - 24 - 8).bezierLoop}</style>
        <div className="flex flex-col gap-4">
          <BezierCurveEditor
            size={128}
            value={selectedValue.value}
            onChange={handleValueChange}
            outerAreaSize={0}
            allowNodeEditing={false}
            duration={duration}
            delay={delay}
          />
          <div className="flex h-6 items-center">
            <strong
              className={tcx(
                PRESET_EASINGS.some((v) => v.name === selectedValue.name)
                  ? ""
                  : "w-40 min-w-0 text-xs",
              )}
            >
              {selectedValue.name}
            </strong>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs">Preview</span>
            <div className="bg-secondary-background relative h-8 w-40 rounded-lg">
              <div
                className="absolute top-1 left-1 size-6 rounded-md bg-white shadow-xs"
                style={previewAnimationStyle}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {PRESET_EASINGS.map((item, index) => (
            <PresetEasingItem
              key={index}
              item={item}
              index={index}
              isSelected={selectedValue.name === item.name}
              isHovered={isHovered === index}
              duration={duration}
              delay={delay}
              onHover={setIsHovered}
              onClick={handlePresetClick}
            />
          ))}
        </div>
      </div>
    )
  },
}

// 优化预设项组件，避免重复渲染
const PresetEasingItem = React.memo<{
  delay: number
  duration: number
  index: number
  isHovered: boolean
  isSelected: boolean
  item: { name: string; value: BezierCurveValueType }
  onClick: (item: { name: string; value: BezierCurveValueType }) => void
  onHover: (index: number | null) => void
  /* eslint-disable react/prop-types */
}>(function PresetEasingItem({
  item,
  index,
  isSelected,
  isHovered,
  duration,
  delay,
  onHover,
  onClick,
}) {
  const handleMouseEnter = useCallback(() => onHover(index), [onHover, index])
  const handleMouseLeave = useCallback(() => onHover(null), [onHover])
  const handleClick = useCallback(() => onClick(item), [onClick, item])

  // 缓存样式计算
  const containerClassName = useMemo(
    () =>
      tcx(
        "bg-default-background rounded-md border",
        isSelected ? "border-selected-boundary" : "",
        isHovered ? "bg-selected-background text-accent-foreground" : "",
      ),
    [isSelected, isHovered],
  )

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center gap-2 text-xs"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <BezierCurveEditor
        className={containerClassName}
        size={64}
        value={item.value}
        outerAreaSize={0}
        allowNodeEditing={false}
        disabledPoints={[true, true]}
        enablePreview={isHovered}
        duration={duration}
        delay={delay}
        showPlane={false}
      />
      <span>{item.name}</span>
    </div>
  )
})
/* eslint-enable react/prop-types */
