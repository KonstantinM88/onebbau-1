import {getRequestConfig} from 'next-intl/server';
import {locales, type Locale} from './config';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({requestLocale}) => {
  const maybe = await requestLocale;
  const locale: Locale = isLocale(maybe) ? maybe : 'de';

  return {
    locale, // важно: next-intl ожидает, что locale будет возвращён
    messages: (await import(`./dictionaries/${locale}.json`)).default
  };
});
