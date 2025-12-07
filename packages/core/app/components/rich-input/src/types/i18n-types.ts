// Internationalization configuration
export interface RichInputI18n {
  url?: {
    doneButton?: string
    placeholder?: string
  }
}

// Default internationalization configuration
export const defaultI18n: Required<RichInputI18n> = {
  url: {
    placeholder: "Enter link url",
    doneButton: "Done",
  },
}
