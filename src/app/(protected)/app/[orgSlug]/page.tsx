import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';

interface OrgPageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgIndexPage({ params }: OrgPageProps) {
  const { orgSlug } = await params;
  redirect(ROUTES.app.dashboard(orgSlug));
}
