import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

export async function redirectTo(href: string): Promise<never> {
  const locale = await getLocale();
  return redirect({ href, locale });
}
