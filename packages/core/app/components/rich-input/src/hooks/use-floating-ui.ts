import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react"
import { useRef, useMemo, useCallback } from "react"
import type { FloatingUIState, UseFloatingUIOptions } from "../types"

// 缓存中间件配置以避免重复创建
const createMiddleware = (overflowOptions: object) => [
  inline(),
  flip(),
  shift({
    crossAxis: true,
    ...overflowOptions,
  }),
]

const createParagraphMiddleware = (overflowOptions: object, offsetValue: number) => [
  offset(offsetValue),
  flip(),
  inline(),
  shift({
    padding: 20,
    ...overflowOptions,
  }),
]

export const useFloatingUI = (options: UseFloatingUIOptions = {}): FloatingUIState => {
  const slateRef = useRef<HTMLDivElement>(null)

  // 缓存容器边界计算，只在容器变化时重新计算
  const containerRect = useMemo(() => {
    return options.containerRect ?? slateRef.current?.getBoundingClientRect()
  }, [options.containerRect])

  // 缓存溢出选项配置
  const overflowOptionsInSlateContainer = useMemo(
    () =>
      containerRect === undefined
        ? {}
        : {
            boundary: {
              x: containerRect.x - 90,
              y: containerRect.y - 36,
              width: containerRect.width + 90,
              height: containerRect.height + 72,
            },
          },
    [containerRect],
  )

  // 缓存中间件配置
  const charactersMiddleware = useMemo(
    () => createMiddleware(overflowOptionsInSlateContainer),
    [overflowOptionsInSlateContainer],
  )

  const urlMiddleware = useMemo(
    () => [
      offset(6),
      inline(),
      flip(),
      shift({
        crossAxis: true,
        ...overflowOptionsInSlateContainer,
      }),
    ],
    [overflowOptionsInSlateContainer],
  )

  const paragraphCollapsedMiddleware = useMemo(
    () => createParagraphMiddleware(overflowOptionsInSlateContainer, -2),
    [overflowOptionsInSlateContainer],
  )

  const paragraphExpandedMiddleware = useMemo(
    () => createParagraphMiddleware(overflowOptionsInSlateContainer, 0),
    [overflowOptionsInSlateContainer],
  )

  // Characters floating UI
  const {
    update: charactersUpdate,
    refs: charactersRefs,
    y: charactersY,
    x: charactersX,
    floatingStyles: charactersFloatingStyles,
    context: charactersContext,
    placement: charactersPlacement,
  } = useFloating({
    placement: "top",
    middleware: charactersMiddleware,
    whileElementsMounted: autoUpdate,
  })
  const charactersDismiss = useDismiss(charactersContext, {
    // 允许点击内部元素时不关闭
    bubbles: false,
  })
  const { getFloatingProps: getCharactersFloatingProps } = useInteractions([charactersDismiss])

  // URL floating UI
  const {
    update: urlUpdate,
    refs: urlRefs,
    floatingStyles: urlFloatingStyles,
    context: urlContext,
    placement: urlPlacement,
  } = useFloating({
    placement: "bottom",
    middleware: urlMiddleware,
    whileElementsMounted: autoUpdate,
  })
  const urlDismiss = useDismiss(urlContext)
  const { getFloatingProps: getUrlFloatingProps } = useInteractions([urlDismiss])

  // Paragraph floating UI - Collapsed state (20x20)
  const {
    update: paragraphCollapsedUpdate,
    refs: paragraphCollapsedRefs,
    x: paragraphCollapsedX,
    y: paragraphCollapsedY,
    floatingStyles: paragraphCollapsedFloatingStyles,
    context: paragraphCollapsedContext,
    placement: paragraphCollapsedPlacement,
  } = useFloating({
    placement: "left",
    middleware: paragraphCollapsedMiddleware,
    whileElementsMounted: autoUpdate,
  })

  const paragraphCollapsedDismiss = useDismiss(paragraphCollapsedContext)
  const { getFloatingProps: getParagraphCollapsedFloatingProps } = useInteractions([
    paragraphCollapsedDismiss,
  ])

  // Paragraph floating UI - Expanded state (76x76)
  const {
    update: paragraphExpandedUpdate,
    refs: paragraphExpandedRefs,
    x: paragraphExpandedX,
    y: paragraphExpandedY,
    floatingStyles: paragraphExpandedFloatingStyles,
    context: paragraphExpandedContext,
    placement: paragraphExpandedPlacement,
  } = useFloating({
    placement: "left",
    middleware: paragraphExpandedMiddleware,
    whileElementsMounted: autoUpdate,
  })

  const paragraphExpandedDismiss = useDismiss(paragraphExpandedContext)
  const { getFloatingProps: getParagraphExpandedFloatingProps } = useInteractions([
    paragraphExpandedDismiss,
  ])

  // 批量更新函数，避免多次重复调用
  const updateAllFloatingElements = useCallback(() => {
    charactersUpdate()
    urlUpdate()
    paragraphCollapsedUpdate()
    paragraphExpandedUpdate()
  }, [charactersUpdate, urlUpdate, paragraphCollapsedUpdate, paragraphExpandedUpdate])

  // 缓存返回值，避免每次渲染都创建新对象
  const floatingUIState = useMemo(
    () => ({
      slateRef,
      updateAll: updateAllFloatingElements,
      characters: {
        update: charactersUpdate,
        refs: charactersRefs,
        x: charactersX,
        y: charactersY,
        floatingStyles: charactersFloatingStyles,
        getFloatingProps: getCharactersFloatingProps,
        placement: charactersPlacement,
      },
      url: {
        update: urlUpdate,
        refs: urlRefs,
        floatingStyles: urlFloatingStyles,
        getFloatingProps: getUrlFloatingProps,
        placement: urlPlacement,
      },
      paragraphCollapsed: {
        update: paragraphCollapsedUpdate,
        refs: paragraphCollapsedRefs,
        x: paragraphCollapsedX,
        y: paragraphCollapsedY,
        floatingStyles: paragraphCollapsedFloatingStyles,
        getFloatingProps: getParagraphCollapsedFloatingProps,
        placement: paragraphCollapsedPlacement,
      },
      paragraphExpanded: {
        update: paragraphExpandedUpdate,
        refs: paragraphExpandedRefs,
        x: paragraphExpandedX,
        y: paragraphExpandedY,
        floatingStyles: paragraphExpandedFloatingStyles,
        getFloatingProps: getParagraphExpandedFloatingProps,
        placement: paragraphExpandedPlacement,
      },
    }),
    [
      slateRef,
      updateAllFloatingElements,
      charactersUpdate,
      charactersRefs,
      charactersX,
      charactersY,
      charactersFloatingStyles,
      getCharactersFloatingProps,
      charactersPlacement,
      urlUpdate,
      urlRefs,
      urlFloatingStyles,
      getUrlFloatingProps,
      urlPlacement,
      paragraphCollapsedUpdate,
      paragraphCollapsedRefs,
      paragraphCollapsedX,
      paragraphCollapsedY,
      paragraphCollapsedFloatingStyles,
      getParagraphCollapsedFloatingProps,
      paragraphCollapsedPlacement,
      paragraphExpandedUpdate,
      paragraphExpandedRefs,
      paragraphExpandedX,
      paragraphExpandedY,
      paragraphExpandedFloatingStyles,
      getParagraphExpandedFloatingProps,
      paragraphExpandedPlacement,
    ],
  )

  return floatingUIState
}
