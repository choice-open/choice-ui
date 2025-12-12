import { Button } from "@choice-ui/button"
import { tcx } from "@choice-ui/shared"
import { SearchInput, type SearchInputProps } from "@choice-ui/search-input"
import { forwardRef, memo, useCallback } from "react"
import { MenuSearchEmptyTv } from "../tv"

export const MenuSearch = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { className, onKeyDown, onChange, value, ...rest } = props

  // Handle keyboard navigation - allow arrow keys to navigate to list items
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)

      // Arrow keys: completely交给 useListNavigation 处理，不干扰其逻辑
      if (["ArrowDown", "ArrowUp"].includes(e.key)) {
        // Allow event to propagate to useListNavigation
        return
      }

      // Navigation related keys allow propagation to useListNavigation
      if (["Enter", "Escape", "Tab"].includes(e.key)) {
        return
      }

      // Prevent other keys from propagating to useTypeahead
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

  const tv = MenuSearchEmptyTv()

  return (
    <div
      {...rest}
      className={tcx(tv.root(), className)}
    >
      {children}
      <span className={tv.text()}>{defaultText.searchEmpty}</span>
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
