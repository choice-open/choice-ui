import { Button } from "@choice-ui/button"
import { Dropdown } from "@choice-ui/dropdown"
import { IconButton } from "@choice-ui/icon-button"
import { Popover } from "@choice-ui/popover"
import { tcx } from "@choice-ui/shared"
import { Tooltip } from "@choice-ui/tooltip"
import { Check, InteractionNone, SystemPreferences } from "@choiceform/icons-react"
import { round } from "es-toolkit"
import { useMemo, useState } from "react"
import tinycolor from "tinycolor2"
import { ColorSwatch } from "../color-swatch"
import { translation } from "../contents"
import type { ColorContrast } from "../types/colors"
import type { ColorContrastLabels } from "../types/paint"
import { calculateContrastRatio, getContrastThreshold, getEffectiveElementType } from "../utils"

interface CheckColorContrastToolbarProps {
  applyRecommendedPoint?: () => boolean
  checkColorContrast?: ColorContrast
  className?: string
  containerWidth?: number
  labels?: ColorContrastLabels
  onStandardHovered?: (hovered: boolean) => void
}

export const CheckColorContrastToolbar = (props: CheckColorContrastToolbarProps) => {
  const { className, checkColorContrast, onStandardHovered, applyRecommendedPoint, labels } = props

  const [showInfo, setShowInfo] = useState(false)

  const colorInfo = useMemo(() => {
    return {
      bgColor: tinycolor(checkColorContrast?.backgroundColor).toHex(),
      fgColor: tinycolor(checkColorContrast?.foregroundColor).toHex(),
    }
  }, [checkColorContrast])

  // 计算用于显示和计算的有效元素类型
  const effectiveElementType = useMemo(
    () =>
      getEffectiveElementType(
        checkColorContrast?.category,
        checkColorContrast?.selectedElementType,
      ),
    [checkColorContrast?.category, checkColorContrast?.selectedElementType],
  )

  // 计算对比度并检查是否符合标准 (use effectiveElementType)
  const { contrastRatio, meetsStandard } = useMemo(() => {
    const ratio = calculateContrastRatio(
      checkColorContrast?.backgroundColor ?? { r: 255, g: 255, b: 255 },
      checkColorContrast?.foregroundColor ?? { r: 0, g: 0, b: 0 },
      checkColorContrast?.foregroundAlpha ?? 1,
    )

    const threshold = getContrastThreshold(
      checkColorContrast?.level,
      checkColorContrast?.category,
      effectiveElementType,
    )

    const roundedRatio = round(ratio, 2)
    return { contrastRatio: roundedRatio, meetsStandard: ratio >= threshold }
  }, [
    checkColorContrast?.backgroundColor,
    checkColorContrast?.foregroundColor,
    checkColorContrast?.foregroundAlpha,
    checkColorContrast?.level,
    checkColorContrast?.category,
    effectiveElementType,
  ])

  const contrastInfo =
    checkColorContrast?.contrastInfo !== undefined ? checkColorContrast.contrastInfo : contrastRatio

  // 获取 AA 级别的显示文本
  const getAADisplayText = () => {
    if (effectiveElementType === "text") {
      // 根据文本类别判断显示内容
      if (checkColorContrast?.category === "large-text") {
        // 复用图形的 key，因为它有正确的比例 (3:1) 用于 AA 大文本
        return translation.colorContrast.level.AA.GRAPHICS
      } else {
        // 对于普通文本或自动（当有效类型为文本时）使用文本 key
        return translation.colorContrast.level.AA.TEXT
      }
    } else {
      // 对于图形使用图形 key
      return translation.colorContrast.level.AA.GRAPHICS
    }
  }

  // 获取 AAA 级别的显示文本
  const getAAADisplayText = () => {
    if (effectiveElementType === "text") {
      // 根据文本类别判断显示内容
      if (checkColorContrast?.category === "large-text") {
        // 使用特定的大文本 key 用于 AAA (4.5:1)
        return translation.colorContrast.level.AAA.LARGE_TEXT
      } else {
        // 对于普通文本或自动使用默认文本 key (7:1)
        return translation.colorContrast.level.AAA.TEXT
      }
    } else {
      // 对于图形使用图形 key（表示没有标准）
      return translation.colorContrast.level.AAA.GRAPHICS
    }
  }

  return (
    <div className={tcx("flex h-10 items-center gap-1 border-b px-2", className)}>
      <Popover
        open={showInfo}
        onOpenChange={setShowInfo}
        placement="left-start"
      >
        <Popover.Trigger>
          <Tooltip
            content={labels?.viewColorValues ?? translation.colorContrast.VIEW_COLOR_VALUES}
            placement="top"
          >
            <Button
              className="px-1"
              variant="ghost"
              active={showInfo}
              onClick={() => setShowInfo(!showInfo)}
            >
              <div className="border-default-boundary flex items-center justify-center rounded-full border">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z"
                      fill={`#${colorInfo.bgColor}`}
                    />
                    <path
                      d="M6 10C7.06087 10 8.07828 9.57857 8.82843 8.82843C9.57857 8.07828 10 7.06087 10 6C10 4.93913 9.57857 3.92172 8.82843 3.17157C8.07828 2.42143 7.06087 2 6 2L6 6L6 10Z"
                      fill={`#${colorInfo.fgColor}`}
                    />
                  </g>
                </svg>
              </div>
              <span>{contrastInfo}</span>
              <span className="text-secondary-foreground">: 1</span>
            </Button>
          </Tooltip>
        </Popover.Trigger>
        <Popover.Content className="flex flex-col gap-2 p-3">
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <span className="text-secondary-foreground">
              {translation.colorContrast.BACKGROUND_COLOR}
            </span>
            <div className="flex items-center gap-1">
              <ColorSwatch
                color={checkColorContrast?.backgroundColor}
                className="rounded-md"
                size={16}
              />
              <span className="uppercase">{colorInfo.bgColor}</span>
            </div>
            <span className="text-secondary-foreground">
              {translation.colorContrast.FOREGROUND_COLOR}
            </span>
            <div className="flex items-center gap-1">
              <ColorSwatch
                color={checkColorContrast?.foregroundColor}
                alpha={checkColorContrast?.foregroundAlpha ?? 1}
                className="rounded-md"
                size={16}
              />
              <span className="uppercase">{colorInfo.fgColor}</span>
            </div>
          </div>
        </Popover.Content>
      </Popover>

      <div className="flex flex-1 items-center justify-end gap-1">
        {meetsStandard ? (
          <div className="flex items-center gap-1 border border-transparent px-1">
            <Check />
            <span className="cursor-default">{checkColorContrast?.level}</span>
          </div>
        ) : (
          <Tooltip
            content={labels?.notMeetStandard ?? translation.colorContrast.NOT_MEET_STANDARD}
            placement="top"
          >
            <Button
              variant="ghost"
              className="px-1"
              onMouseEnter={() => onStandardHovered?.(true)}
              onMouseLeave={() => onStandardHovered?.(false)}
              onClick={applyRecommendedPoint}
            >
              <InteractionNone />
              <span>{checkColorContrast?.level}</span>
            </Button>
          </Tooltip>
        )}

        <Dropdown
          disabledNested
          selection
        >
          <Dropdown.Trigger asChild>
            <IconButton
              tooltip={{
                content: labels?.contrastSettings ?? translation.colorContrast.CONTRAST_SETTINGS,
                placement: "top",
              }}
            >
              <SystemPreferences />
            </IconButton>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Label>{translation.colorContrast.category.LABEL}</Dropdown.Label>
            <Dropdown.Item
              selected={checkColorContrast?.category === "auto"}
              onMouseUp={() => {
                checkColorContrast?.handleCategoryChange?.("auto")
                // 如果切换到自动（图形）且当前等级为 AAA，则切换等级为 AA
                if (
                  (checkColorContrast?.selectedElementType ?? "graphics") === "graphics" &&
                  checkColorContrast?.level === "AAA"
                ) {
                  checkColorContrast?.handleLevelChange?.("AA")
                }
              }}
            >
              {effectiveElementType === "text"
                ? translation.colorContrast.category.auto.TEXT
                : translation.colorContrast.category.auto.GRAPHICS}
            </Dropdown.Item>
            <Dropdown.Item
              selected={checkColorContrast?.category === "large-text"}
              onMouseUp={() => checkColorContrast?.handleCategoryChange?.("large-text")}
            >
              {translation.colorContrast.category.LARGE_TEXT}
            </Dropdown.Item>
            <Dropdown.Item
              selected={checkColorContrast?.category === "normal-text"}
              onMouseUp={() => checkColorContrast?.handleCategoryChange?.("normal-text")}
            >
              {translation.colorContrast.category.NORMAL_TEXT}
            </Dropdown.Item>
            <Dropdown.Item
              selected={checkColorContrast?.category === "graphics"}
              onMouseUp={() => {
                checkColorContrast?.handleCategoryChange?.("graphics")
                // 如果切换到图形且当前等级为 AAA，则切换等级为 AA
                if (checkColorContrast?.level === "AAA") {
                  checkColorContrast?.handleLevelChange?.("AA")
                }
              }}
            >
              {translation.colorContrast.category.GRAPHICS}
            </Dropdown.Item>
            <Dropdown.Label>{translation.colorContrast.level.LABEL}</Dropdown.Label>
            <Dropdown.Item
              selected={checkColorContrast?.level === "AA"}
              onMouseUp={() => checkColorContrast?.handleLevelChange?.("AA")}
            >
              {getAADisplayText()}
            </Dropdown.Item>
            <Dropdown.Item
              disabled={effectiveElementType === "graphics"}
              selected={checkColorContrast?.level === "AAA"}
              onMouseUp={() => checkColorContrast?.handleLevelChange?.("AAA")}
            >
              {getAAADisplayText()}
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
