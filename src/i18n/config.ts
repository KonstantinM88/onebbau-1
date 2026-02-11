export const locales = ['de', 'ru'] as const;
export const defaultLocale = 'de' as const;
export type Locale = (typeof locales)[number];
