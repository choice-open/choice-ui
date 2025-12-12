import { Chip } from "@choice-ui/chip"
import { mergeRefs, tcx } from "@choice-ui/shared"
import { Slot } from "@choice-ui/slot"
import { useControllableValue } from "ahooks"
import {
  type FocusEvent,
  forwardRef,
  type HTMLProps,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { chipsInputTv } from "./tv"

export interface RenderChipProps {
  chip: string
  disabled?: boolean
  handleChipClick: (index: number) => void
  handleChipRemoveClick: (index: number) => void
  index: number
  isSelected: boolean
}

export interface ChipsInputProps extends Omit<
  HTMLProps<HTMLDivElement>,
  "value" | "onChange" | "defaultValue" | "size"
> {
  allowDuplicates?: boolean
  children?: React.ReactNode
  disabled?: boolean
  id?: string
  onAdd?: (value: string) => void
  onChange?: (value: string[]) => void
  onRemove?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  renderChip?: (props: RenderChipProps) => ReactNode
  size?: "default" | "large"
  value?: string[]
}

export const ChipsInput = forwardRef<HTMLDivElement, ChipsInputProps>((props, ref) => {
  const {
    id,
    className,
    value: valueProp,
    onChange,
    onAdd,
    onRemove,
    placeholder,
    disabled,
    readOnly = false,
    size,
    onKeyDown,
    onClick,
    children,
    allowDuplicates = false,
    renderChip,
    ...rest
  } = props

  const [chips, setChips] = useControllableValue<string[]>(props, {
    defaultValue: [],
    valuePropName: "value",
    trigger: "onChange",
  })

  const [inputValue, setInputValue] = useState("")
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const tv = chipsInputTv({ size, disabled, hasValue: chips.length > 0 })

  const addChip = useCallback(
    (chipToAdd: string) => {
      if (readOnly) return

      const trimmedChip = chipToAdd.trim()
      if (trimmedChip && (allowDuplicates || !chips.includes(trimmedChip))) {
        const newChips = [...chips, trimmedChip]
        setChips(newChips)
        onAdd?.(trimmedChip)
        setInputValue("")
      }
    },
    [chips, setChips, onAdd, allowDuplicates, readOnly],
  )

  const removeChip = useCallback(
    (indexToRemove: number) => {
      if (readOnly) return

      const chipToRemove = chips[indexToRemove]
      const newChips = chips.filter((_chip: string, index: number) => index !== indexToRemove)
      setChips(newChips)
      if (chipToRemove !== undefined) {
        onRemove?.(chipToRemove)
      }
    },
    [chips, setChips, onRemove, readOnly],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
      onKeyDown?.(e as KeyboardEvent<HTMLDivElement>)

      if (readOnly) return

      if (selectedChipIndex !== null && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault()
        removeChip(selectedChipIndex)
        setSelectedChipIndex(null)
        inputRef.current?.focus()
        return
      }

      if (e.target === inputRef.current) {
        const currentInput = e.target as HTMLInputElement
        if (e.key === "Enter" && !isComposing && currentInput.value) {
          e.preventDefault()
          addChip(currentInput.value)
          setInputValue("")
        } else if (e.key === "Backspace" && !currentInput.value && chips.length > 0) {
          if (selectedChipIndex === null) {
            removeChip(chips.length - 1)
          }
        }
      }
    },
    [onKeyDown, selectedChipIndex, chips, removeChip, addChip, isComposing, readOnly],
  )

  const handleContainerClick = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    if (e.target === e.currentTarget) {
      setSelectedChipIndex(null)
      inputRef.current?.focus()
    }
  })

  const handleInputFocus = useEventCallback((e: FocusEvent<HTMLInputElement>) => {
    setSelectedChipIndex(null)
    props.onFocus?.(e)
  })

  const handleInputBlur = useEventCallback((e: FocusEvent<HTMLInputElement>) => {
    if (!readOnly) {
      // When input loses focus, if there's content, convert it to a chip
      const trimmedValue = inputValue.trim()
      if (trimmedValue) {
        // Check if it's a duplicate when allowDuplicates is false
        if (!allowDuplicates && chips.includes(trimmedValue)) {
          // If it's a duplicate, just clear the input without adding
          setInputValue("")
        } else {
          // Add the chip (this will also clear the input if successful)
          addChip(inputValue)
        }
      }
    }
    props.onBlur?.(e)
  })

  const handleChipClick = useEventCallback((index: number) => {
    if (selectedChipIndex === index) {
      setSelectedChipIndex(null)
      inputRef.current?.focus()
    } else {
      setSelectedChipIndex(index)
      containerRef.current?.focus()
    }
  })

  const handleChipRemoveClick = useEventCallback((index: number) => {
    if (readOnly) return
    removeChip(index)
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedChipIndex !== null &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedChipIndex(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedChipIndex])

  const inputWidth = useMemo(() => {
    return `${Math.max(inputValue.length, (chips.length === 0 ? placeholder?.length : 0) || 1) + 2}ch`
  }, [inputValue, chips, placeholder])

  return (
    <div
      ref={mergeRefs(ref, containerRef)}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={tcx(tv.root(), className)}
      onClick={handleContainerClick}
      aria-disabled={disabled}
      {...rest}
    >
      {chips.map((chip: string, index: number) => {
        const isSelected = selectedChipIndex === index

        const chipProps: RenderChipProps = {
          chip,
          index,
          isSelected,
          disabled,
          handleChipClick,
          handleChipRemoveClick,
        }

        return renderChip ? (
          <Slot key={`${chip}-${index}`}>{renderChip(chipProps)}</Slot>
        ) : (
          <Chip
            key={`${chip}-${index}`}
            selected={isSelected}
            onClick={() => handleChipClick(index)}
            onRemove={readOnly ? undefined : () => handleChipRemoveClick(index)}
            size={size === "large" ? "medium" : "default"}
            disabled={disabled}
            className={tcx(tv.chip())}
          >
            {chip}
          </Chip>
        )
      })}

      <input
        id={id}
        ref={inputRef}
        className={tcx(tv.input())}
        disabled={disabled || readOnly}
        onChange={(e) => {
          if (!readOnly) {
            setInputValue(e.target.value)
          }
        }}
        onCompositionEnd={() => setIsComposing(false)}
        onCompositionStart={() => setIsComposing(true)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={chips.length === 0 ? placeholder : ""}
        value={inputValue}
        readOnly={readOnly}
        style={{
          width: inputWidth,
        }}
      />

      {children && <div className={tcx(tv.nesting())}>{children}</div>}
    </div>
  )
})

ChipsInput.displayName = "ChipsInput"
