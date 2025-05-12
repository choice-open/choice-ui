import { forwardRef, memo, useCallback } from "react"
import { tcx } from "~/utils"
import { Button } from "../../button"
import { SearchInput, type SearchInputProps } from "../../search-input"
import { MenuSearchEmptyTv } from "../tv"

export const MenuSearch = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const {
    className,
    onKeyDown,

    ...rest
  } = props

  // 阻止键盘事件冒泡，防止被 useTypeahead 截获
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)

      e.stopPropagation()
    },
    [onKeyDown],
  )

  return (
    <SearchInput
      {...rest}
      ref={ref}
      autoFocus
      onKeyDown={handleKeyDown}
      variant="dark"
    />
  )
})

MenuSearch.displayName = "MenuSearch"

interface MenuSearchEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  onClear?: () => void
  children?: React.ReactNode
  defaultText?: {
    searchEmpty: string
    searchEmptyButton: string
  }
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
