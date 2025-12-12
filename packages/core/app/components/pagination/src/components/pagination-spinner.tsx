import { Button } from "@choice-ui/button"
import { tcx } from "@choice-ui/shared"
import { ChevronLeftMedium, ChevronRightMedium } from "@choiceform/icons-react"
import { forwardRef, useEffect, useRef, useState } from "react"
import { useEventCallback, useOnClickOutside } from "usehooks-ts"
import { usePaginationContext } from "../context"
import { paginationSpinnerTv } from "../tv"
import type { PaginationSpinnerProps } from "../types"

export const PaginationSpinner = forwardRef<HTMLDivElement, PaginationSpinnerProps>(
  (props, ref) => {
    const { className, ...rest } = props
    const [inputValue, setInputValue] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    const inputWrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useOnClickOutside(inputWrapperRef, () => {
      if (isEditing) {
        // Trigger blur to save the value
        inputRef.current?.blur()
      }
    })

    const { currentPage, totalPages, handlePageChange, disabled } = usePaginationContext()

    const tv = paginationSpinnerTv()

    // Sync input value with current page when editing starts
    useEffect(() => {
      if (isEditing) {
        setInputValue(currentPage.toString())
      }
    }, [isEditing, currentPage])

    // Handle focus and selection separately
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
        // type="number" does not support selection APIs (setSelectionRange/select)
        if (inputRef.current.type === "number") return

        const timer = setTimeout(() => {
          const el = inputRef.current
          if (!el) return
          if (el.type === "number") return

          try {
            el.setSelectionRange(0, el.value.length)
          } catch {
            // Ignore selection errors (e.g. unsupported environments)
          }
        }, 0)

        return () => clearTimeout(timer)
      }
    }, [isEditing])

    const handleInputChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    })

    const submitPageChange = useEventCallback(() => {
      const page = parseInt(inputValue, 10)
      if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
        handlePageChange(page)
      }
      setIsEditing(false)
      setInputValue("")
    })

    const handleInputKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        submitPageChange()
      } else if (e.key === "Escape") {
        setIsEditing(false)
        setInputValue("")
      }
    })

    const handleInputBlur = useEventCallback(() => {
      submitPageChange()
    })

    const handlePrevious = useEventCallback(() => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    })

    const handleNext = useEventCallback(() => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    })

    return (
      <div
        ref={ref}
        className={tcx(tv.spinner(), className)}
        {...rest}
      >
        <Button
          variant="solid"
          disabled={currentPage === 1 || disabled}
          onClick={handlePrevious}
          aria-label="Previous page"
          className={tv.button({ position: "left" })}
        >
          <ChevronLeftMedium />
        </Button>

        <div
          ref={inputWrapperRef}
          className={tv.inputWrapper()}
          onClick={() => {
            if (!isEditing) {
              setIsEditing(true)
            }
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              type="number"
              min={1}
              max={totalPages}
              disabled={disabled}
              className={tv.input()}
              autoFocus
            />
          ) : (
            <span className={tcx(tv.currentPage())}>{currentPage}</span>
          )}
          <span className={tv.label()}>/ {totalPages}</span>
        </div>

        <Button
          variant="solid"
          disabled={currentPage === totalPages || disabled}
          onClick={handleNext}
          aria-label="Next page"
          className={tv.button({ position: "right" })}
        >
          <ChevronRightMedium />
        </Button>
      </div>
    )
  },
)

PaginationSpinner.displayName = "Pagination.Spinner"
