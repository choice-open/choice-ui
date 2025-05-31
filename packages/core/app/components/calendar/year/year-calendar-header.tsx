import { ChevronLeftSmall, ChevronRightSmall, Undo } from "@choiceform/icons-react"
import { Locale } from "date-fns"
import { memo, useMemo } from "react"
import { IconButton } from "~/components/icon-button"
import { resolveLocale } from "../utils/locale"
import { YearCalendarTv } from "./tv"

interface Props {
  currentYearContainsToday: boolean
  endDisplayYear: number
  handleNext: () => void
  handlePrevious: () => void
  handleToday: () => void
  isNextDisabled: boolean
  isPrevDisabled: boolean
  locale: Locale | string
  startDisplayYear: number
  variant: "default" | "dark"
}

export const YearCalendarHeader = memo(function YearCalendarHeader(props: Props) {
  const {
    endDisplayYear,
    handleNext,
    handlePrevious,
    handleToday,
    isNextDisabled,
    isPrevDisabled,
    locale: propLocale,
    startDisplayYear,
    currentYearContainsToday,
    variant,
  } = props

  const tv = YearCalendarTv()

  const safeLocale = resolveLocale(propLocale)

  const labels = useMemo(() => {
    const localeKey = typeof propLocale === "string" ? propLocale : safeLocale.code || "en-US"

    if (localeKey.startsWith("zh")) {
      return {
        prevLabel: "上一组年份",
        nextLabel: "下一组年份",
        selectYear: "选择年份",
        todayLabel: "今天",
      }
    }
    if (localeKey.startsWith("ja")) {
      return {
        prevLabel: "前の年",
        nextLabel: "次の年",
        selectYear: "年を選択",
        todayLabel: "今日",
      }
    }
    if (localeKey.startsWith("ko")) {
      return {
        prevLabel: "이전 년도",
        nextLabel: "다음 년도",
        selectYear: "년도 선택",
        todayLabel: "오늘",
      }
    }
    if (localeKey.startsWith("de")) {
      return {
        prevLabel: "Vorherige Jahre",
        nextLabel: "Nächste Jahre",
        selectYear: "Jahr auswählen",
        todayLabel: "Heute",
      }
    }
    if (localeKey.startsWith("fr")) {
      return {
        prevLabel: "Années précédentes",
        nextLabel: "Années suivantes",
        selectYear: "Sélectionner l'année",
        todayLabel: "Aujourd'hui",
      }
    }
    if (localeKey.startsWith("es")) {
      return {
        prevLabel: "Años anteriores",
        nextLabel: "Años siguientes",
        selectYear: "Seleccionar año",
        todayLabel: "Hoy",
      }
    }
    return {
      prevLabel: "Previous years",
      nextLabel: "Next years",
      selectYear: "Select year",
      todayLabel: "Today",
    }
  }, [propLocale, safeLocale.code])

  return (
    <div className={tv.header()}>
      <h3 className={tv.title()}>
        {startDisplayYear} - {endDisplayYear}
      </h3>

      {currentYearContainsToday ? null : (
        <IconButton
          variant={variant}
          onClick={handleToday}
          aria-label={labels.todayLabel}
        >
          <Undo />
        </IconButton>
      )}
      <div className={tv.navigation()}>
        <IconButton
          variant={variant}
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          aria-label={labels.prevLabel}
        >
          <ChevronLeftSmall />
        </IconButton>
        <IconButton
          variant={variant}
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label={labels.nextLabel}
        >
          <ChevronRightSmall />
        </IconButton>
      </div>
    </div>
  )
})

YearCalendarHeader.displayName = "YearCalendarHeader"
