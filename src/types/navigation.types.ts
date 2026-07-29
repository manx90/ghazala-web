import type { LucideIcon } from 'lucide-react';
import type { Permission } from '@/utils/permission';

export type ShellVariant = 'client' | 'admin';

export interface NavBadge {
  value: number | string;
  variant?: 'default' | 'secondary' | 'destructive';
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: NavBadge;
  children?: NavItem[];
  exact?: boolean;
}

export interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type SearchCategory = 'contacts' | 'conversations' | 'templates' | 'organizations' | 'users';

export interface SearchCategoryConfig {
  id: SearchCategory;
  label: string;
  enabled: boolean;
  description: string;
}
