import { queryKeys as baseKeys } from '@/config/query';

export const queryKeys = {
  ...baseKeys,
  conversations: {
    all: ['conversations'] as const,
    list: (params?: Record<string, unknown>) => ['conversations', 'list', params] as const,
    statistics: ['conversations', 'statistics'] as const,
    detail: (id: string) => ['conversations', id] as const,
    messages: (id: string, params?: Record<string, unknown>) =>
      ['conversations', id, 'messages', params] as const,
  },
  contacts: {
    all: ['contacts'] as const,
    list: (params?: Record<string, unknown>) => ['contacts', 'list', params] as const,
    detail: (id: string) => ['contacts', id] as const,
  },
  templates: {
    all: ['templates'] as const,
    list: ['templates', 'list'] as const,
    detail: (id: string) => ['templates', id] as const,
  },
  messages: {
    all: ['messages'] as const,
    list: ['messages', 'list'] as const,
    detail: (id: string) => ['messages', id] as const,
    status: (id: string) => ['messages', id, 'status'] as const,
  },
  whatsapp: {
    businessAccounts: ['whatsapp', 'business-accounts'] as const,
    phoneNumbers: ['whatsapp', 'phone-numbers'] as const,
  },
  meta: {
    status: ['meta', 'status'] as const,
  },
  onboarding: {
    all: ['onboarding'] as const,
    state: (orgSlug?: string | null) => ['onboarding', 'state', orgSlug ?? 'none'] as const,
  },
  billing: {
    plans: ['billing', 'plans'] as const,
    subscription: ['billing', 'subscription'] as const,
    invoices: ['billing', 'invoices'] as const,
  },
  members: {
    list: ['members', 'list'] as const,
  },
  dashboard: ['dashboard'] as const,
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    organizations: {
      all: ['admin', 'organizations'] as const,
      list: (params?: Record<string, unknown>) => ['admin', 'organizations', 'list', params] as const,
      detail: (id: string) => ['admin', 'organizations', id] as const,
    },
    users: {
      all: ['admin', 'users'] as const,
      list: (params?: Record<string, unknown>) => ['admin', 'users', 'list', params] as const,
      detail: (id: string) => ['admin', 'users', id] as const,
    },
    plans: {
      all: ['admin', 'plans'] as const,
      list: ['admin', 'plans', 'list'] as const,
    },
    health: ['admin', 'health'] as const,
  },
} as const;
