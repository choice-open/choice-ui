import { Check } from "@choiceform/icons-react"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"
import { Menus } from "../../menus"
import type { BaseTimeProps, StepProps } from "../types"
import { generateTimeOptions, normalizeTimeValue, timeStringToDate } from "../utils"

export interface TimeCalendarProps extends BaseTimeProps, StepProps {
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 小时步进，默认1小时 */
  hourStep?: number
  /** 分钟步进，默认15分钟 */
  minuteStep?: number
}

export const TimeCalendar = memo(function TimeCalendar(props: TimeCalendarProps) {
  const {
    value,
    defaultValue,
    onChange,
    format: timeFormat = "HH:mm",
    step = 15,
    className,
    children,
    ...rest
  } = props

  // References
  const scrollRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([])
  const customElementRef = useRef<HTMLButtonElement | null>(null) // 自定义时间项的独立 ref
  const hasInitialScrolled = useRef(false)
  const lastSelectedIndexRef = useRef<number | null>(null)
  const isInternalOperationRef = useRef(false)

  // Local state management
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  // Use useMergedValue to manage controlled/uncontrolled state
  const [innerValue, setValue] = useMergedValue({
    value,
    defaultValue,
    onChange: onChange,
    allowEmpty: true,
  })

  // Generate time options - 保持完全稳定
  const timeOptions = useMemo(() => {
    return generateTimeOptions(timeFormat, step)
  }, [timeFormat, step])

  const normalizedTimeString = useMemo(() => {
    return normalizeTimeValue(innerValue)
  }, [innerValue])

  const formatTo12Hour = useCallback((timeStr: string): string => {
    const [hour, minute] = timeStr.split(":").map(Number)
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? "AM" : "PM"
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`
  }, [])

  const customTimeOption = useMemo(() => {
    if (!normalizedTimeString) return null

    // 检查是否在标准选项中
    const hasStandardOption = timeOptions.some((option) => option.value === normalizedTimeString)
    if (hasStandardOption) return null

    // 生成自定义选项
    const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
    return {
      value: normalizedTimeString,
      label: is12Hour ? formatTo12Hour(normalizedTimeString) : normalizedTimeString,
    }
  }, [normalizedTimeString, timeOptions, timeFormat, formatTo12Hour]) // 添加 formatTo12Hour 到依赖数组

  const renderTimeLabel = useCallback(
    (label: string) => {
      // 检查是否为12小时格式 - 检查格式字符串中是否包含12小时制标识
      const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
      if (is12Hour && label.includes(" ")) {
        const [timePart, ampmPart] = label.split(" ")
        return (
          <>
            <span>{timePart}</span>
            <span className="flex-1 text-right text-white/40">{ampmPart}</span>
          </>
        )
      }
      return label
    },
    [timeFormat],
  )

  const selectedIndex = useMemo(() => {
    if (!normalizedTimeString) return null

    // 在标准选项中查找
    const index = timeOptions.findIndex((option) => option.value === normalizedTimeString)

    // 如果找到了，返回索引；如果没找到，说明是自定义时间，返回 -1
    return index === -1 ? -1 : index
  }, [normalizedTimeString, timeOptions])

  // Check if we need divider between AM and PM
  const needsDivider = useMemo(() => {
    // 检查是否为12小时格式 - 检查格式字符串中是否包含12小时制标识
    const is12Hour = timeFormat.toLowerCase().includes("a") || timeFormat === "12h"
    if (!is12Hour) return () => false

    return (index: number) => {
      return (
        index > 0 &&
        timeOptions[index].label.includes("PM") &&
        timeOptions[index - 1].label.includes("AM")
      )
    }
  }, [timeFormat, timeOptions])

  // Create prefix element like DropdownItem does
  const createPrefixElement = useCallback((isSelected: boolean) => {
    return isSelected ? <Check /> : <></>
  }, [])

  // 滚动事件处理：滚动时隐藏 active，停止后立即恢复
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null)

  const handleScroll = useEventCallback(() => {
    // 开始滚动时立即隐藏 active 状态
    if (!isScrolling) {
      setIsScrolling(true)
      setActiveIndex(null)
    }

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 滚动停止后立即恢复 active 状态显示
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)

      // 使用记录的鼠标位置检测应该激活的元素
      if (mousePositionRef.current) {
        const elementUnderMouse = document.elementFromPoint(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
        )

        // 首先检查自定义时间项
        if (
          customElementRef.current &&
          (customElementRef.current === elementUnderMouse ||
            customElementRef.current.contains(elementUnderMouse))
        ) {
          setActiveIndex(-1)
          return
        }

        // 检查标准时间项
        const elements = elementsRef.current
        for (let i = 0; i < elements.length; i++) {
          if (
            elements[i] &&
            (elements[i] === elementUnderMouse || elements[i]?.contains(elementUnderMouse))
          ) {
            setActiveIndex(i)
            break
          }
        }
      }
    }, 200)
  })

  // 记录鼠标位置
  const handleMouseMove = useEventCallback((event: React.MouseEvent) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY }
  })

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // 智能滚动逻辑：支持初始化滚动和外部值变化滚动
  useEffect(() => {
    // 处理自定义时间项（selectedIndex = -1）
    if (selectedIndex === -1) {
      const customElement = customElementRef.current
      if (!customElement || !scrollRef.current) {
        return
      }

      const previousSelectedIndex = lastSelectedIndexRef.current
      const isSelectedIndexChanged = previousSelectedIndex !== selectedIndex

      // 记录当前选中的索引
      lastSelectedIndexRef.current = selectedIndex

      // 判断是否需要滚动
      const shouldScroll =
        !hasInitialScrolled.current || // 初始化滚动
        (isSelectedIndexChanged && !isInternalOperationRef.current) // 外部值变化滚动

      if (shouldScroll) {
        const isInitialScroll = !hasInitialScrolled.current

        if (isInitialScroll) {
          // 自定义项总是在顶部，直接滚动到顶部
          scrollRef.current.scrollTo({
            top: 0,
            behavior: "auto",
          })
        } else {
          // 确保自定义项可见
          customElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          })
        }

        // 标记已完成初始化滚动
        if (!hasInitialScrolled.current) {
          hasInitialScrolled.current = true
        }
      }

      // 重置内部操作标记
      if (isInternalOperationRef.current) {
        isInternalOperationRef.current = false
      }
      return
    }

    // 处理标准时间项
    if (selectedIndex === null || !scrollRef.current || !elementsRef.current[selectedIndex]) {
      return
    }

    const previousSelectedIndex = lastSelectedIndexRef.current
    const isSelectedIndexChanged = previousSelectedIndex !== selectedIndex

    // 记录当前选中的索引
    lastSelectedIndexRef.current = selectedIndex

    // 判断是否需要滚动
    const shouldScroll =
      !hasInitialScrolled.current || // 初始化滚动
      (isSelectedIndexChanged && !isInternalOperationRef.current) // 外部值变化滚动

    if (shouldScroll) {
      // 初始化滚动：定位到中间，无动画
      // 受控/键盘导航滚动：自然定位（nearest），平滑动画
      const isInitialScroll = !hasInitialScrolled.current

      if (isInitialScroll) {
        // 初始化滚动：居中对齐
        elementsRef.current[selectedIndex]?.scrollIntoView({
          block: "center",
          behavior: "auto",
        })
      } else {
        // 受控/键盘导航滚动：带 8px 边距的智能定位
        const container = scrollRef.current
        const element = elementsRef.current[selectedIndex]

        if (container && element) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const margin = 8 // 8px 边距

          // 计算元素相对于容器的位置
          const elementTop = elementRect.top - containerRect.top + container.scrollTop
          const elementBottom = elementTop + elementRect.height

          // 容器可视区域（考虑边距）
          const visibleTop = container.scrollTop + margin
          const visibleBottom = container.scrollTop + container.clientHeight - margin

          let targetScrollTop = container.scrollTop

          // 如果元素在可视区域上方，向下滚动
          if (elementTop < visibleTop) {
            targetScrollTop = elementTop - margin
          }
          // 如果元素在可视区域下方，向上滚动
          else if (elementBottom > visibleBottom) {
            targetScrollTop = elementBottom - container.clientHeight + margin
          }

          // 平滑滚动到目标位置
          if (targetScrollTop !== container.scrollTop) {
            container.scrollTo({
              top: targetScrollTop,
            })
          }
        }
      }

      // 标记已完成初始化滚动
      if (!hasInitialScrolled.current) {
        hasInitialScrolled.current = true
      }
    }

    // 重置内部操作标记
    if (isInternalOperationRef.current) {
      isInternalOperationRef.current = false
    }
  }, [selectedIndex])

  // Handle time selection
  const handleTimeSelect = useEventCallback((timeValue: string) => {
    // 标记为内部操作，避免触发自动滚动
    isInternalOperationRef.current = true

    // Convert time string to Date object using public utility
    const dateValue = timeStringToDate(timeValue)
    setValue(dateValue)
  })

  // Handle mouse enter - ignore during scrolling
  const handleMouseEnter = useEventCallback((index: number) => {
    // 滚动时不设置 active 状态
    if (isScrolling) {
      return
    }
    setActiveIndex(index)
  })

  // Handle mouse leave from container
  const handleMouseLeave = useEventCallback(() => {
    setActiveIndex(null)
  })

  // Handle click selection
  const handleClick = useEventCallback((timeValue: string) => {
    handleTimeSelect(timeValue)
  })

  return (
    <Menus
      ref={scrollRef}
      onScroll={handleScroll}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={className}
      data-testid="time-calendar-menu"
      {...rest}
    >
      {/* 自定义时间项（如果存在） */}
      {customTimeOption && (
        <>
          <Menus.Item
            ref={(node) => {
              customElementRef.current = node
            }}
            selected={selectedIndex === -1}
            active={!isScrolling && activeIndex === -1}
            onClick={() => handleClick(customTimeOption.value)}
            onMouseEnter={() => handleMouseEnter(-1)}
            prefixElement={createPrefixElement(selectedIndex === -1)}
            variant="highlight"
            data-testid="custom-time-item"
          >
            {renderTimeLabel(customTimeOption.label)}
          </Menus.Item>
          <Menus.Divider data-testid="custom-time-divider" />
        </>
      )}

      {/* 标准时间列表 */}
      {timeOptions.map((option, index) => {
        const isAmToPmTransition = needsDivider(index)
        const isItemSelected = selectedIndex === index
        // 滚动时不显示 active 状态
        const isItemActive = !isScrolling && activeIndex === index

        return (
          <React.Fragment key={option.value}>
            {isAmToPmTransition && <Menus.Divider data-testid="ampm-divider" />}
            <Menus.Item
              ref={(node) => {
                elementsRef.current[index] = node
              }}
              selected={isItemSelected}
              active={isItemActive}
              onClick={() => handleClick(option.value)}
              onMouseEnter={() => handleMouseEnter(index)}
              prefixElement={createPrefixElement(isItemSelected)}
              variant="highlight"
              data-testid={option.value}
            >
              {renderTimeLabel(option.label)}
            </Menus.Item>
          </React.Fragment>
        )
      })}

      {children}
    </Menus>
  )
})

TimeCalendar.displayName = "TimeCalendar"
