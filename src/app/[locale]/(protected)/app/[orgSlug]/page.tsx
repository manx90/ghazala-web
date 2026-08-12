import { redirectTo } from '@/i18n/server-redirect';
import { ROUTES } from '@/config/routes';

interface OrgPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgIndexPage({ params }: OrgPageProps) {
  const { orgSlug } = await params;
  await redirectTo(ROUTES.app.dashboard(orgSlug));
}
