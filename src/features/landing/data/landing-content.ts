import {
  BarChart3Icon,
  BotIcon,
  Code2Icon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  RadioTowerIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  WorkflowIcon,
  ZapIcon,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import type { LucideIcon } from 'lucide-react';

export const LANDING_NAV_LINKS = [
  { href: '#features', key: 'features' },
  { href: '#product', key: 'product' },
  { href: '#automation', key: 'automation' },
  { href: '#api', key: 'api' },
  { href: '#faq', key: 'faq' },
] as const;

export const HERO_STATS = [
  { value: '99.9%', labelKey: 'uptime' },
  { value: '+2M', labelKey: 'messages' },
  { value: '<100ms', labelKey: 'latency' },
] as const;

export const FEATURE_ITEMS = [
  { icon: InboxIcon, key: 'inbox' },
  { icon: BotIcon, key: 'automation' },
  { icon: RadioTowerIcon, key: 'broadcast' },
  { icon: MessageSquareTextIcon, key: 'templates' },
  { icon: Code2Icon, key: 'api' },
  { icon: BarChart3Icon, key: 'analytics' },
] as const;

export const SPLIT_SECTION_CONFIG = [
  { id: 'automation', icon: WorkflowIcon, visual: 'automation' as const, key: 'automation' },
  { id: 'inbox', icon: UsersIcon, visual: 'inbox' as const, key: 'inbox' },
  { id: 'broadcast', icon: ZapIcon, visual: 'broadcast' as const, key: 'broadcast' },
  { id: 'api', icon: Code2Icon, visual: 'api' as const, key: 'api' },
  { id: 'analytics', icon: BarChart3Icon, visual: 'analytics' as const, key: 'analytics' },
] as const;

export const SECURITY_BADGE_KEYS = [
  { icon: ShieldCheckIcon, key: 'encryption' },
  { icon: ZapIcon, key: 'uptime' },
  { icon: BotIcon, key: 'meta' },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    columnKey: 'product' as const,
    links: [
      { labelKey: 'features', href: '#features' },
      { labelKey: 'automation', href: '#automation' },
      { labelKey: 'api', href: '#api' },
      { labelKey: 'faq', href: '#faq' },
    ],
  },
  {
    columnKey: 'account' as const,
    links: [
      { labelKey: 'login', href: ROUTES.auth.login, auth: true },
      { labelKey: 'register', href: ROUTES.auth.register, auth: true },
    ],
  },
  {
    columnKey: 'legal' as const,
    links: [
      { labelKey: 'terms', href: '/terms' },
      { labelKey: 'privacy', href: '/privacy' },
    ],
  },
] as const;

export const PRODUCT_SIDEBAR_ITEMS = [
  { icon: LayoutDashboardIcon, key: 'dashboard', active: true },
  { icon: InboxIcon, key: 'inbox', active: false },
  { icon: UsersIcon, key: 'contacts', active: false },
  { icon: RadioTowerIcon, key: 'campaigns', active: false },
  { icon: MessageSquareTextIcon, key: 'templates', active: false },
  { icon: SettingsIcon, key: 'settings', active: false },
] as const;

export const PRODUCT_KPI_KEYS = [
  { key: 'conversations' },
  { key: 'responseTime' },
  { key: 'satisfaction' },
] as const;

export const CHART_BARS = [38, 52, 44, 66, 58, 74, 62, 84, 70, 92, 80, 96] as const;

export type SplitVisualKey = (typeof SPLIT_SECTION_CONFIG)[number]['visual'];

export type FeatureItemConfig = {
  icon: LucideIcon;
  key: string;
};
