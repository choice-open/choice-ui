import { forwardRef, memo, useCallback } from "react"
import { tcx } from "~/utils"
import { Button } from "../../button"
import { SearchInput, type SearchInputProps } from "../../search-input"
import { MenuSearchEmptyTv } from "../tv"

export const MenuSearch = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { className, onKeyDown, onChange, value, ...rest } = props

  // 处理键盘导航 - 允许箭头键导航到列表项
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)

      // 箭头键：完全交给 useListNavigation 处理，不干扰其逻辑
      if (["ArrowDown", "ArrowUp"].includes(e.key)) {
        // 允许事件传播给 useListNavigation
        return
      }

      // 导航相关的键允许传播给 useListNavigation
      if (["Enter", "Escape", "Tab"].includes(e.key)) {
        return
      }

      // 阻止其他键传播到 useTypeahead
      e.stopPropagation()
    },
    [onKeyDown],
  )

  return (
    <SearchInput
      {...rest}
      ref={ref}
      value={value}
      onChange={onChange}
      autoFocus
      onKeyDown={handleKeyDown}
      variant="dark"
    />
  )
})

MenuSearch.displayName = "MenuSearch"

interface MenuSearchEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  defaultText?: {
    searchEmpty: string
    searchEmptyButton: string
  }
  onClear?: () => void
}

export const MenuSearchEmpty = memo(function MenuSearchEmpty(props: MenuSearchEmptyProps) {
  const {
    onClear,
    className,
    children,
    defaultText = {
      searchEmpty: "No results found, please try another keyword",
      searchEmptyButton: "Clear",
    },
    ...rest
  } = props

  const styles = MenuSearchEmptyTv()

  return (
    <div
      {...rest}
      className={tcx(styles.root(), className)}
    >
      {children}
      <span className={styles.text()}>{defaultText.searchEmpty}</span>
      <Button
        variant="link"
        onClick={onClear}
      >
        {defaultText.searchEmptyButton}
      </Button>
    </div>
  )
})

MenuSearchEmpty.displayName = "MenuSearchEmpty"
