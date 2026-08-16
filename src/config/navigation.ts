import {
  Building2Icon,
  ContactIcon,
  CreditCardIcon,
  FileTextIcon,
  FlagIcon,
  HeartPulseIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldIcon,
  SmartphoneIcon,
  UserIcon,
  UsersIcon,
  ActivityIcon,
  WebhookIcon,
  WalletIcon,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import type { NavGroup, SearchCategory } from '@/types/navigation.types';

type NavTranslator = (key: string) => string;

export function getClientNavigation(orgSlug: string, t: NavTranslator): NavGroup[] {
  return [
    {
      id: 'main',
      items: [
        {
          id: 'dashboard',
          label: t('dashboard'),
          href: ROUTES.app.dashboard(orgSlug),
          icon: LayoutDashboardIcon,
          permission: 'org.read',
          exact: true,
        },
        {
          id: 'inbox',
          label: t('inbox'),
          href: ROUTES.app.inbox(orgSlug),
          icon: InboxIcon,
          permission: 'messages.read',
        },
        {
          id: 'contacts',
          label: t('contacts'),
          href: ROUTES.app.contacts(orgSlug),
          icon: ContactIcon,
          permission: 'contacts.read',
        },
        {
          id: 'templates',
          label: t('templates'),
          href: ROUTES.app.templates(orgSlug),
          icon: FileTextIcon,
          permission: 'templates.read',
        },
        {
          id: 'messages',
          label: t('messages'),
          href: ROUTES.app.messages(orgSlug),
          icon: MessageSquareIcon,
          permission: 'messages.read',
        },
      ],
    },
    {
      id: 'settings',
      label: t('settings'),
      items: [
        {
          id: 'settings',
          label: t('settings'),
          href: ROUTES.app.settings.root(orgSlug),
          icon: SettingsIcon,
          permission: 'org.read',
          children: [
            {
              id: 'settings-organization',
              label: t('organization'),
              href: ROUTES.app.settings.organization(orgSlug),
              icon: Building2Icon,
              permission: 'org.manage',
            },
            {
              id: 'settings-team',
              label: t('team'),
              href: ROUTES.app.settings.team(orgSlug),
              icon: UsersIcon,
              permission: 'team.manage',
            },
            {
              id: 'settings-whatsapp',
              label: 'WhatsApp',
              href: ROUTES.app.settings.whatsapp(orgSlug),
              icon: SmartphoneIcon,
              permission: 'whatsapp.manage',
            },
            {
              id: 'settings-meta',
              label: 'Meta',
              href: ROUTES.app.settings.meta(orgSlug),
              icon: ShieldIcon,
              permission: 'meta.manage',
            },
            {
              id: 'settings-billing',
              label: t('billing'),
              href: ROUTES.app.settings.billing(orgSlug),
              icon: CreditCardIcon,
              permission: 'billing.manage',
            },
            {
              id: 'settings-profile',
              label: t('profile'),
              href: ROUTES.app.settings.profile(orgSlug),
              icon: UserIcon,
              permission: 'org.read',
            },
            {
              id: 'settings-security',
              label: t('security'),
              href: ROUTES.app.settings.security(orgSlug),
              icon: ShieldIcon,
              permission: 'org.read',
            },
          ],
        },
      ],
    },
  ];
}

export function getAdminNavigation(tNav: NavTranslator, tAdmin: NavTranslator): NavGroup[] {
  return [
    {
      id: 'main',
      items: [
        {
          id: 'admin-dashboard',
          label: tNav('dashboard'),
          href: ROUTES.admin.dashboard,
          icon: LayoutDashboardIcon,
          permission: 'platform.admin',
          exact: true,
        },
        {
          id: 'admin-organizations',
          label: tAdmin('nav.organizations'),
          href: ROUTES.admin.organizations,
          icon: Building2Icon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-users',
          label: tAdmin('nav.users'),
          href: ROUTES.admin.users,
          icon: UsersIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-plans',
          label: tAdmin('nav.plans'),
          href: ROUTES.admin.plans,
          icon: CreditCardIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-whop',
          label: tAdmin('nav.whop'),
          href: ROUTES.admin.whop,
          icon: WalletIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-subscriptions',
          label: tAdmin('nav.subscriptions'),
          href: ROUTES.admin.subscriptions,
          icon: FileTextIcon,
          permission: 'platform.admin',
        },
      ],
    },
    {
      id: 'platform',
      label: tAdmin('nav.platform'),
      items: [
        {
          id: 'admin-audit-logs',
          label: tAdmin('nav.auditLogs'),
          href: ROUTES.admin.auditLogs,
          icon: ScrollTextIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-feature-flags',
          label: tAdmin('nav.featureFlags'),
          href: ROUTES.admin.featureFlags,
          icon: FlagIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-announcements',
          label: tAdmin('nav.announcements'),
          href: ROUTES.admin.announcements,
          icon: MegaphoneIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-meta-config',
          label: tAdmin('nav.metaConfig'),
          href: ROUTES.admin.metaConfig,
          icon: WebhookIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-settings',
          label: tNav('settings'),
          href: ROUTES.admin.settings,
          icon: SettingsIcon,
          permission: 'platform.admin',
        },
      ],
    },
    {
      id: 'system',
      label: tAdmin('nav.system'),
      items: [
        {
          id: 'admin-health',
          label: tAdmin('nav.systemHealth'),
          href: ROUTES.admin.system.health,
          icon: HeartPulseIcon,
          permission: 'platform.admin',
        },
        {
          id: 'admin-monitoring',
          label: tAdmin('nav.monitoring'),
          href: ROUTES.admin.system.monitoring,
          icon: ActivityIcon,
          permission: 'platform.admin',
        },
      ],
    },
  ];
}

export const SEARCH_CATEGORY_IDS: SearchCategory[] = [
  'contacts',
  'conversations',
  'templates',
  'organizations',
  'users',
];

export const BREADCRUMB_KEYS = [
  'app',
  'admin',
  'dashboard',
  'inbox',
  'contacts',
  'templates',
  'messages',
  'settings',
  'organization',
  'team',
  'whatsapp',
  'meta',
  'billing',
  'profile',
  'security',
  'webhooks',
  'api-keys',
  'organizations',
  'users',
  'plans',
  'whop',
  'subscriptions',
  'system',
  'health',
  'monitoring',
  'audit-logs',
  'feature-flags',
  'announcements',
  'meta-config',
  'global-settings',
  'new',
] as const;

export type BreadcrumbKey = (typeof BREADCRUMB_KEYS)[number];
