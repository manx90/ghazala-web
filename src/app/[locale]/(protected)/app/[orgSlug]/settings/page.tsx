import { redirectTo } from '@/i18n/server-redirect';
import { ROUTES } from '@/config/routes';

interface SettingsPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { orgSlug } = await params;
  await redirectTo(ROUTES.app.settings.organization(orgSlug));
}
