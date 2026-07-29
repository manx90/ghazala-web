import {
  Building2Icon,
  CreditCardIcon,
  KeyIcon,
  ShieldIcon,
  SmartphoneIcon,
  UserIcon,
  UsersIcon,
  WebhookIcon,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import type { Permission } from '@/utils/permission';
import type { LucideIcon } from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  label: string;
  href: (orgSlug: string) => string;
  icon: LucideIcon;
  permission?: Permission;
}

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    id: 'organization',
    label: 'المنظمة',
    href: ROUTES.app.settings.organization,
    icon: Building2Icon,
    permission: 'org.manage',
  },
  {
    id: 'team',
    label: 'الفريق',
    href: ROUTES.app.settings.team,
    icon: UsersIcon,
    permission: 'team.manage',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: ROUTES.app.settings.whatsapp,
    icon: SmartphoneIcon,
    permission: 'whatsapp.manage',
  },
  {
    id: 'meta',
    label: 'Meta',
    href: ROUTES.app.settings.meta,
    icon: ShieldIcon,
    permission: 'meta.manage',
  },
  {
    id: 'billing',
    label: 'الفوترة',
    href: ROUTES.app.settings.billing,
    icon: CreditCardIcon,
    permission: 'billing.manage',
  },
  {
    id: 'profile',
    label: 'الملف الشخصي',
    href: ROUTES.app.settings.profile,
    icon: UserIcon,
    permission: 'org.read',
  },
  {
    id: 'security',
    label: 'الأمان',
    href: ROUTES.app.settings.security,
    icon: ShieldIcon,
    permission: 'org.read',
  },
  {
    id: 'webhooks',
    label: 'Webhooks',
    href: ROUTES.app.settings.webhooks,
    icon: WebhookIcon,
    permission: 'org.manage',
  },
  {
    id: 'api-keys',
    label: 'مفاتيح API',
    href: ROUTES.app.settings.apiKeys,
    icon: KeyIcon,
    permission: 'org.manage',
  },
];
