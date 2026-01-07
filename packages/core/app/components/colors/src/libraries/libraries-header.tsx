import { IconButton } from "@choice-ui/icon-button"
import { Input } from "@choice-ui/input"
import { Select } from "@choice-ui/select"
import { FontBulletedSmall, Grid, Search } from "@choiceform/icons-react"
import { forwardRef, Fragment } from "react"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import { colorLibrariesHeaderTv } from "./tv"
import type { LibrariesDisplayType } from "../types"

interface LibrariesHeaderProps {
  actionElement?: React.ReactNode
  allowDisplayTypeSwitch?: boolean
  categoryOptions: { label?: string; value?: string }[]
  displayType?: LibrariesDisplayType
  inputRef: React.RefObject<HTMLInputElement>
  onChange?: (category: string) => void
  onDisplayTypeChange?: (type: LibrariesDisplayType) => void
  onSearchChange?: (value: string) => void
  searchValue?: string
  value: string
}

export const LibrariesHeader = forwardRef<HTMLDivElement, LibrariesHeaderProps>(
  function LibrariesHeader(props, ref) {
    const {
      searchValue,
      onSearchChange,
      displayType,
      onDisplayTypeChange,
      inputRef,
      categoryOptions,
      value,
      onChange,
      allowDisplayTypeSwitch,
      actionElement,
    } = props

    const showDisplay =
      allowDisplayTypeSwitch && (displayType === "LIST" || displayType === "LARGE_GRID")

    const styles = colorLibrariesHeaderTv({
      isLibrariesPane: displayType === "LIST" || displayType === "LARGE_GRID",
    })

    const handleCategoryChange = useEventCallback((value: string) => {
      onChange?.(value)
    })

    const handleDisplayTypeChange = useEventCallback(() => {
      if (displayType === "SMALL_GRID") return
      const newDisplayType = displayType === "LIST" ? "LARGE_GRID" : "LIST"
      onDisplayTypeChange?.(newDisplayType)
    })

    const handleSearchChange = useEventCallback((value: string) => {
      onSearchChange?.(value)
    })

    return (
      <div
        ref={ref}
        className={styles.container()}
      >
        {displayType !== "SMALL_GRID" && (
          <div className="flex items-center border-b px-4 py-2">
            <Search />
            <Input
              autoFocus
              ref={inputRef}
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={translation.common.SEARCH}
              variant="reset"
              className="flex-1"
            />
          </div>
        )}

        <div className={styles.selections()}>
          <Select
            matchTriggerWidth={displayType === "SMALL_GRID"}
            value={value}
            onChange={handleCategoryChange}
          >
            <Select.Trigger
              aria-label={translation.libraries.LABEL}
              className={displayType === "SMALL_GRID" ? "flex-1" : undefined}
            >
              <span className="flex-1 truncate">
                {categoryOptions.find((option) => option.value === value)?.label}
              </span>
            </Select.Trigger>
            <Select.Content>
              {categoryOptions.map((option) => (
                <Fragment key={option.value}>
                  <Select.Item
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Item>
                  {option.value === "all" && <Select.Divider />}
                </Fragment>
              ))}
            </Select.Content>
          </Select>

          {showDisplay && (
            <IconButton
              tooltip={{
                content:
                  displayType === "LIST"
                    ? translation.libraries.SWITCH_TO_GRID
                    : translation.libraries.SWITCH_TO_LIST,
              }}
              onClick={handleDisplayTypeChange}
            >
              {displayType === "LIST" ? <Grid /> : <FontBulletedSmall />}
            </IconButton>
          )}

          {actionElement}
        </div>
      </div>
    )
  },
)

LibrariesHeader.displayName = "LibrariesHeader"
