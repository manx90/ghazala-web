import { redirectTo } from '@/i18n/server-redirect';
import { ROUTES } from '@/config/routes';

export default async function AdminRootPage() {
  await redirectTo(ROUTES.admin.dashboard);
}
