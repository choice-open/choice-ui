import { memo, useMemo } from "react"
import type { FloatingMenusContainerProps } from "../types"
import { CharactersMenu } from "./characters-menu"
import { ParagraphMenu } from "./paragraph-menu"
import { UrlMenu } from "./url-menu"

export const FloatingMenusContainer = memo(function FloatingMenusContainer(
  props: FloatingMenusContainerProps,
) {
  const {
    editor,
    isFocused,
    editorInView,
    enterFormatting,
    portalElementId,
    floatingUI,
    editorState,
    charactersOptions,
    paragraphOptions,
    isHover,
    i18n,
  } = props

  // 缓存显示条件，避免重复计算
  const shouldShowMenus = useMemo(
    () => enterFormatting && (isFocused || editorState.characters.switchUrlInput),
    [enterFormatting, isFocused, editorState.characters.switchUrlInput],
  )

  // 缓存段落菜单配置，避免每次渲染时重新计算
  const paragraphMenuConfig = useMemo(() => {
    const isExpanded = editorState.paragraph.isExpanded
    const config = isExpanded ? floatingUI.paragraphExpanded : floatingUI.paragraphCollapsed

    return {
      refs: config.refs,
      floatingStyles: config.floatingStyles,
      getFloatingProps: config.getFloatingProps,
      placement: config.placement,
      update: config.update,
    }
  }, [
    editorState.paragraph.isExpanded,
    floatingUI.paragraphExpanded,
    floatingUI.paragraphCollapsed,
  ])

  // 缓存字符菜单props，减少不必要的重新渲染
  const charactersMenuProps = useMemo(
    () => ({
      isHover,
      isOpen: editorState.characters.isStyleOpen,
      editorInView,
      portalElementId,
      refs: floatingUI.characters.refs,
      floatingStyles: floatingUI.characters.floatingStyles,
      x: floatingUI.characters.x,
      y: floatingUI.characters.y,
      getFloatingProps: floatingUI.characters.getFloatingProps,
      charactersOptions,
      switchUrlInput: editorState.characters.switchUrlInput,
      setSwitchUrlInput: editorState.characters.setSwitchUrlInput,
      charactersUrl: editorState.characters.url,
      setCharactersUrl: editorState.characters.setUrl,
      setIsCharactersStyleOpen: editorState.characters.setIsStyleOpen,
      placement: floatingUI.characters.placement,
      i18n,
    }),
    [
      isHover,
      editorState.characters.isStyleOpen,
      editorInView,
      portalElementId,
      floatingUI.characters,
      charactersOptions,
      editorState.characters.switchUrlInput,
      editorState.characters.setSwitchUrlInput,
      editorState.characters.url,
      editorState.characters.setUrl,
      editorState.characters.setIsStyleOpen,
      i18n,
    ],
  )

  // 缓存URL菜单props
  const urlMenuProps = useMemo(
    () => ({
      isOpen: editorState.url.isOpen,
      editorInView,
      portalElementId,
      refs: floatingUI.url.refs,
      floatingStyles: floatingUI.url.floatingStyles,
      getFloatingProps: floatingUI.url.getFloatingProps,
      charactersUrl: editorState.characters.url,
    }),
    [
      editorState.url.isOpen,
      editorInView,
      portalElementId,
      floatingUI.url,
      editorState.characters.url,
    ],
  )

  if (!shouldShowMenus) {
    return null
  }

  return (
    <>
      <ParagraphMenu
        editor={editor}
        isHover={isHover}
        isOpen={editorState.paragraph.isStyleOpen}
        editorInView={editorInView}
        portalElementId={portalElementId}
        {...paragraphMenuConfig}
        paragraphOptions={paragraphOptions}
        isParagraphExpanded={editorState.paragraph.isExpanded}
        setIsParagraphExpanded={editorState.paragraph.setIsExpanded}
      />

      <UrlMenu {...urlMenuProps} />

      <CharactersMenu {...charactersMenuProps} />
    </>
  )
})
