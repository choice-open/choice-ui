import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react"
import tinycolor from "tinycolor2"
import { useEventCallback } from "usehooks-ts"
import { CheckColorContrastBoundary, CheckColorContrastToolbar } from "../check-color-contrast"
import { translation } from "../contents"
import { useColorContrastRecommendation, usePaintState, useRgbColorHandler } from "../hooks"
import type {
  BoundaryCalculationResult,
  ChannelFieldSpace,
  ColorContrast,
  PaintState,
  RGB,
  SolidPaintFeature,
} from "../types/colors"
import type { LibrariesType } from "../types/libraries"
import type { SolidPaintLabels } from "../types/paint"
import type { Variable } from "../types/variable"
import { calculateContrastRatio, getContrastThreshold, getEffectiveElementType } from "../utils"
import { ColorNativePicker } from "./color-native-picker"
import { SolidPaintAlphaSlider } from "./solid-paint-alpha-slider"
import { SolidPaintArea } from "./solid-paint-area"
import { SolidPaintChannelField } from "./solid-paint-channel-field"
import { SolidPaintHueSlider } from "./solid-paint-hue-slider"
import { ColorSolidPaintTv } from "./tv"

export interface ColorSolidPaintProps {
  alpha?: number
  checkColorContrast?: ColorContrast
  className?: string
  color?: RGB
  colorSpace: ChannelFieldSpace
  features?: SolidPaintFeature
  labels?: SolidPaintLabels
  library?: ReactNode
  onAlphaChange?: (alpha: number) => void
  onChangeEnd?: () => void
  onChangeStart?: () => void
  onColorChange?: (color: RGB) => void
  onColorSpaceChange: (colorSpace: ChannelFieldSpace) => void
  onLibraryChange?: (value: { item: Variable; type: LibrariesType }) => void
}

export const ColorSolidPaint = forwardRef<HTMLDivElement, ColorSolidPaintProps>(
  function ColorSolidPaint(props, ref) {
    const {
      className,
      color = { r: 250, g: 250, b: 250 },
      alpha: opacity = 1,
      onColorChange,
      onAlphaChange,
      labels,
      features: userFeatures = {},
      checkColorContrast: originalCheckColorContrast,
      onChangeStart,
      onChangeEnd,
      library,
      colorSpace,
      onColorSpaceChange,
    } = props

    // 使用自定义 hooks 管理颜色状态
    const { paintState, setPaintState, updateSourceRef } = usePaintState({ color })
    const { handleRgbChange } = useRgbColorHandler({
      paintState,
      setPaintState,
      updateSourceRef,
      colorSpace,
      onColorChange,
    })

    const features: SolidPaintFeature = useMemo(() => {
      return {
        containerWidth: 240,
        presets: true,
        spaceDropdown: true,
        alpha: true,
        hex: true,
        rgb: true,
        hsl: true,
        hsb: true,
        checkColorContrast: true,
        nativePicker: true,
        ...userFeatures,
      }
    }, [userFeatures])

    const handleNativeColorChange = useEventCallback((rgb: RGB) => {
      onColorChange?.(rgb)
    })

    const sliderTrackSize = useMemo(() => {
      const getPadding = () => {
        if (!features.alpha && !features.nativePicker) {
          return 32
        }
        let padding = 0
        padding += features.alpha ? 32 : 16
        padding += features.nativePicker ? 48 : 0
        return padding
      }
      return {
        width: (features?.containerWidth ?? 240) - getPadding(),
        height: 16,
      }
    }, [features.containerWidth, features.alpha, features.nativePicker])

    const styles = ColorSolidPaintTv({
      alpha: features.alpha,
      nativePicker: features.nativePicker,
      presets: features.presets,
    })

    const [standardHovered, setStandardHovered] = useState(false)

    const selectedElementType = originalCheckColorContrast?.selectedElementType ?? "graphics"
    const backgroundColor = originalCheckColorContrast?.backgroundColor
    const contrastLevel = originalCheckColorContrast?.level
    const contrastCategory = originalCheckColorContrast?.category
    const showContrast = originalCheckColorContrast?.showColorContrast

    const checkColorContrastForChild = useMemo((): ColorContrast | undefined => {
      if (!originalCheckColorContrast) return undefined
      return {
        ...originalCheckColorContrast,
        foregroundColor: color,
        foregroundAlpha: opacity,
        selectedElementType: selectedElementType,
      }
    }, [originalCheckColorContrast, color, opacity, selectedElementType])

    const containerWidth = features?.containerWidth ?? 240

    const stableContrastHookOnColorChange = useEventCallback(
      (newColor: RGB, newAlpha: number, preserveHue?: number) => {
        // 如果传入了 preserveHue，说明是从 applyRecommendedPoint 调用的
        // 需要直接设置 paintState 的 hue，避免 RGB→HSL 转换导致的 hue 漂移
        if (preserveHue !== undefined) {
          // 标记为内部更新，避免 usePaintState 的 useEffect 重新计算 hue
          updateSourceRef.current = "internal"

          // 从 RGB 计算 HSL/HSV 的 s 和 l/v，但保持原始 hue
          const tc = tinycolor(newColor)
          const hsl = tc.toHsl()
          const hsv = tc.toHsv()

          setPaintState({
            h: preserveHue, // 使用传入的原始 hue，不从 RGB 重新计算
            hsl_s: hsl.s,
            l: hsl.l,
            hsv_s: hsv.s,
            v: hsv.v,
          })
        }

        onColorChange?.(newColor)
        onAlphaChange?.(newAlpha)
        setStandardHovered(false)
      },
    )

    const contrastOptions = useMemo(
      () => ({
        onColorChange: stableContrastHookOnColorChange,
      }),
      [stableContrastHookOnColorChange],
    )

    const {
      recommendedPoint,
      boundaryData: calculatedBoundaryData,
      updateRecommendedPoint,
      applyRecommendedPoint,
    } = useColorContrastRecommendation({
      width: containerWidth,
      height: containerWidth,
      hue: paintState.h,
      backgroundColor: backgroundColor || { r: 255, g: 255, b: 255 },
      foregroundAlpha: opacity,
      level: contrastLevel,
      category: contrastCategory,
      selectedElementType,
      options: contrastOptions,
      colorSpace,
      paintState,
    })

    const boundaryDataForChild = useMemo((): BoundaryCalculationResult => {
      if (showContrast && features.checkColorContrast && calculatedBoundaryData) {
        return calculatedBoundaryData
      }
      return { lowerBoundary: null, upperBoundary: null, threshold: 0 }
    }, [showContrast, features.checkColorContrast, calculatedBoundaryData])

    // 当颜色通过对比度检查时，清除 standardHovered 状态
    useEffect(() => {
      if (!showContrast || !standardHovered) return

      const effectiveType = getEffectiveElementType(contrastCategory, selectedElementType)
      const threshold = getContrastThreshold(contrastLevel, contrastCategory, effectiveType)
      const ratio = calculateContrastRatio(
        backgroundColor ?? { r: 255, g: 255, b: 255 },
        color,
        opacity,
      )

      if (ratio >= threshold) {
        setStandardHovered(false)
      }
    }, [
      showContrast,
      standardHovered,
      backgroundColor,
      color,
      opacity,
      contrastLevel,
      contrastCategory,
      selectedElementType,
    ])

    return (
      <>
        {showContrast && features.checkColorContrast && (
          <CheckColorContrastToolbar
            checkColorContrast={checkColorContrastForChild}
            onStandardHovered={setStandardHovered}
            containerWidth={containerWidth}
            applyRecommendedPoint={applyRecommendedPoint}
          />
        )}

        <div
          ref={ref}
          className={className}
          style={{ width: containerWidth }}
        >
          <SolidPaintArea
            paintState={paintState}
            setPaintState={(newState: PaintState) => {
              setPaintState(newState)
            }}
            colorSpace={colorSpace}
            rgbColor={color}
            onColorChange={onColorChange}
            containerWidth={containerWidth}
            updateSourceRef={updateSourceRef}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
          >
            {showContrast && features.checkColorContrast && (
              <CheckColorContrastBoundary
                colorSpace={colorSpace}
                paintState={paintState}
                width={containerWidth}
                height={containerWidth}
                foregroundAlpha={opacity}
                level={contrastLevel}
                category={contrastCategory}
                showRecommendedPoint={standardHovered}
                recommendedPoint={recommendedPoint}
                boundaryData={boundaryDataForChild}
                updateRecommendedPoint={updateRecommendedPoint}
              />
            )}
          </SolidPaintArea>

          <div
            className={styles.sliderContainer()}
            style={{ width: containerWidth }}
          >
            <SolidPaintHueSlider
              hue={paintState.h}
              setHue={(newHue) => {
                const newPaintState = { ...paintState, h: newHue }
                setPaintState(newPaintState)
              }}
              color={color}
              onColorChange={onColorChange}
              onChangeStart={onChangeStart}
              onChangeEnd={onChangeEnd}
              onChange={onChangeEnd}
              type="hue"
              trackSize={sliderTrackSize}
              updateSourceRef={updateSourceRef}
            />

            {features.alpha && (
              <SolidPaintAlphaSlider
                hue={paintState.h}
                alpha={opacity}
                onAlphaChange={onAlphaChange}
                type="alpha"
                trackSize={sliderTrackSize}
                onChangeStart={onChangeStart}
                onChangeEnd={onChangeEnd}
              />
            )}

            {features.nativePicker && (
              <ColorNativePicker
                onChange={handleNativeColorChange}
                className={styles.nativePicker()}
                tooltip={labels?.pickerColor ?? translation.colorNativePicker.PICK_COLOR}
              />
            )}
          </div>

          <SolidPaintChannelField
            paintState={paintState}
            setPaintState={(newState) => {
              setPaintState(newState)
            }}
            colorSpace={colorSpace}
            setColorSpace={onColorSpaceChange}
            updateSourceRef={updateSourceRef}
            rgb={color}
            alpha={opacity}
            onAlphaChange={onAlphaChange}
            onAlphaChangeEnd={onChangeEnd}
            onAlphaChangeStart={onChangeStart}
            onColorChange={handleRgbChange}
            className={styles.channelField()}
            features={features}
            labels={labels}
          />

          {features.presets && library && <>{library}</>}
        </div>
      </>
    )
  },
)
