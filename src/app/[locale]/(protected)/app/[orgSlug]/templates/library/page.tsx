import { redirectTo } from '@/i18n/server-redirect';
import { ROUTES } from '@/config/routes';

export default async function TemplateLibraryRedirectPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  await redirectTo(ROUTES.app.templateLibrary(orgSlug));
}
