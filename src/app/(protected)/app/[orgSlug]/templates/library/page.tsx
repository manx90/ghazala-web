import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';

export default async function TemplateLibraryRedirectPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  redirect(ROUTES.app.templateLibrary(orgSlug));
}
