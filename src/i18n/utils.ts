import { routing, type Locale } from './routing';

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (routing.locales.includes(maybeLocale as Locale)) {
    const rest = segments.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }

  return pathname;
}

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar';
}
