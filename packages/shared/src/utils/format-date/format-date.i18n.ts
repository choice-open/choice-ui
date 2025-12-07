import { enUS, zhCN, ja, ko, es, fr, de, ptBR, ru, ar, type Locale } from "date-fns/locale"
import type { LanguageConfig, SupportedLanguage, TranslationConfig } from "./format-date.types"

const translations: Record<SupportedLanguage, TranslationConfig> = {
  en: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} at ${time}`,
        today: ({ time }) => `Today at ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} at ${time}`,
        yesterday: ({ time }) => `Yesterday at ${time}`,
      },
    },
  },
  cn: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} ${time}`,
        today: ({ time }) => `今天 ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} ${time}`,
        yesterday: ({ time }) => `昨天 ${time}`,
      },
    },
  },
  ja: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} ${time}`,
        today: ({ time }) => `今日 ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} ${time}`,
        yesterday: ({ time }) => `昨日 ${time}`,
      },
    },
  },
  ko: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} ${time}`,
        today: ({ time }) => `오늘 ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} ${time}`,
        yesterday: ({ time }) => `어제 ${time}`,
      },
    },
  },
  es: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} a las ${time}`,
        today: ({ time }) => `Hoy a las ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} a las ${time}`,
        yesterday: ({ time }) => `Ayer a las ${time}`,
      },
    },
  },
  fr: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} à ${time}`,
        today: ({ time }) => `Aujourd'hui à ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} à ${time}`,
        yesterday: ({ time }) => `Hier à ${time}`,
      },
    },
  },
  de: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} um ${time}`,
        today: ({ time }) => `Heute um ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} um ${time}`,
        yesterday: ({ time }) => `Gestern um ${time}`,
      },
    },
  },
  pt: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} às ${time}`,
        today: ({ time }) => `Hoje às ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} às ${time}`,
        yesterday: ({ time }) => `Ontem às ${time}`,
      },
    },
  },
  ru: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} в ${time}`,
        today: ({ time }) => `Сегодня в ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} в ${time}`,
        yesterday: ({ time }) => `Вчера в ${time}`,
      },
    },
  },
  ar: {
    common: {
      relativeTime: {
        dateAt: ({ date, time }) => `${date} في ${time}`,
        today: ({ time }) => `اليوم في ${time}`,
        weekdayAt: ({ time, weekday }) => `${weekday} في ${time}`,
        yesterday: ({ time }) => `أمس في ${time}`,
      },
    },
  },
}

const localeMap: Record<SupportedLanguage, Locale> = {
  ar,
  cn: zhCN,
  de,
  en: enUS,
  es,
  fr,
  ja,
  ko,
  pt: ptBR,
  ru,
}

export function getLanguageConfig(language: SupportedLanguage = "en"): LanguageConfig {
  return {
    language,
    locale: localeMap[language] || localeMap.en,
    t: translations[language] || translations.en,
  }
}
