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
    list: (params?: Record<string, unknown>) => ['templates', 'list', params] as const,
    languages: ['templates', 'languages'] as const,
    library: (params?: Record<string, unknown>) => ['templates', 'library', params] as const,
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
    usage: ['billing', 'usage'] as const,
  },
  members: {
    list: ['members', 'list'] as const,
  },
  dashboard: ['dashboard'] as const,
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    wabaStats: ['admin', 'stats', 'waba'] as const,
    phoneNumberStats: ['admin', 'stats', 'phone-numbers'] as const,
    messageStats: (period?: string) => ['admin', 'stats', 'messages', period] as const,
    revenueStats: ['admin', 'stats', 'revenue'] as const,
    subscriptionSummary: ['admin', 'subscriptions', 'summary'] as const,
    queueStatus: ['admin', 'queue', 'status'] as const,
    workersStatus: ['admin', 'workers', 'status'] as const,
    activityTimeline: ['admin', 'activity', 'timeline'] as const,
    healthDatabase: ['admin', 'health', 'database'] as const,
    healthRedis: ['admin', 'health', 'redis'] as const,
    healthStorage: ['admin', 'health', 'storage'] as const,
    organizations: {
      all: ['admin', 'organizations'] as const,
      list: (params?: Record<string, unknown>) => ['admin', 'organizations', 'list', params] as const,
      detail: (id: string) => ['admin', 'organizations', id] as const,
      usage: (id: string) => ['admin', 'organizations', id, 'usage'] as const,
      subscription: (id: string) => ['admin', 'organizations', id, 'subscription'] as const,
      members: (id: string) => ['admin', 'organizations', id, 'members'] as const,
      phoneNumbers: (id: string) => ['admin', 'organizations', id, 'phone-numbers'] as const,
    },
    users: {
      all: ['admin', 'users'] as const,
      list: (params?: Record<string, unknown>) => ['admin', 'users', 'list', params] as const,
      detail: (id: string) => ['admin', 'users', id] as const,
      organizations: (id: string) => ['admin', 'users', id, 'organizations'] as const,
    },
    plans: {
      all: ['admin', 'plans'] as const,
      list: ['admin', 'plans', 'list'] as const,
    },
    subscriptions: {
      all: ['admin', 'subscriptions'] as const,
      stats: ['admin', 'subscriptions', 'stats'] as const,
      list: (params?: Record<string, unknown>) =>
        ['admin', 'subscriptions', 'list', params] as const,
      detail: (id: string) => ['admin', 'subscriptions', id] as const,
    },
    whop: {
      all: ['admin', 'whop'] as const,
      status: ['admin', 'whop', 'status'] as const,
      plans: ['admin', 'whop', 'plans'] as const,
      payments: (limit?: number) => ['admin', 'whop', 'payments', limit] as const,
      memberships: (limit?: number) => ['admin', 'whop', 'memberships', limit] as const,
      webhookEvents: (limit?: number) => ['admin', 'whop', 'webhook-events', limit] as const,
      promoCodes: {
        all: ['admin', 'whop', 'promo-codes'] as const,
        list: (limit?: number) => ['admin', 'whop', 'promo-codes', limit] as const,
      },
      webhooks: {
        all: ['admin', 'whop', 'webhooks'] as const,
        list: ['admin', 'whop', 'webhooks', 'list'] as const,
      },
    },
    health: ['admin', 'health'] as const,
  },
} as const;
