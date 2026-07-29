import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';

interface SettingsPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { orgSlug } = await params;
  redirect(ROUTES.app.settings.organization(orgSlug));
}
