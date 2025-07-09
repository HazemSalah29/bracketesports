import { en, type TranslationKey } from '@/locales/en'

// Type-safe translation function
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let translation: string = en[key] || key

  // Replace parameters in the translation
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      translation = translation.replace(`{{${paramKey}}}`, String(value))
    })
  }

  return translation
}

// Hook for using translations in React components
export function useTranslation() {
  return { t }
}

// Utility to get all available languages
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English' }
  ]
}

// Utility to format numbers based on locale
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

// Utility to format dates based on locale
export function formatDate(date: Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}

// Utility to format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date, locale: string = 'en-US'): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}
