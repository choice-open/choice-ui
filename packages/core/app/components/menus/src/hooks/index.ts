// Menu hooks for shared logic between Select and Dropdown components

// 通用 hooks（所有菜单组件都使用）
export { useMenuState } from "./use-menu-state"
export { useMenuRefs } from "./use-menu-refs"
export { useMenuTouch } from "./use-menu-touch"
export { useMenuScroll } from "./use-menu-scroll"
export { useMenuChildren } from "./use-menu-children"
export { useMenuFloating } from "./use-menu-floating"
export { useMenuTree } from "./use-menu-tree"
export { useMenuScrollHeight } from "./use-menu-scroll-height"
export { useMenuBaseRefs } from "./use-menu-base-refs"

// Select 专用 hooks
export { useMenuSelection } from "./use-menu-selection"

// 导出类型
export type { MenuStateConfig, MenuStateResult } from "./use-menu-state"

export type { MenuRefsConfig, MenuRefsResult } from "./use-menu-refs"

export type { MenuTouchConfig, MenuTouchResult } from "./use-menu-touch"

export type { MenuScrollConfig, MenuScrollResult } from "./use-menu-scroll"

export type { MenuChildrenConfig, MenuChildrenResult } from "./use-menu-children"

export type { MenuFloatingConfig, MenuFloatingResult } from "./use-menu-floating"

export type { MenuTreeConfig, MenuTreeResult } from "./use-menu-tree"

export type { MenuSelectionConfig, MenuSelectionResult } from "./use-menu-selection"

export type { MenuScrollHeightConfig } from "./use-menu-scroll-height"

export type { MenuBaseRefsResult } from "./use-menu-base-refs"
