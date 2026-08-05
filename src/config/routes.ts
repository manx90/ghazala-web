export const ROUTES = {
  home: '/',

  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
  },

  app: {
    root: '/app',
    dashboard: (orgSlug: string) => `/app/${orgSlug}/dashboard`,
    inbox: (orgSlug: string) => `/app/${orgSlug}/inbox`,
    inboxConversation: (orgSlug: string, conversationId: string) =>
      `/app/${orgSlug}/inbox/${conversationId}`,
    contacts: (orgSlug: string) => `/app/${orgSlug}/contacts`,
    templates: (orgSlug: string) => `/app/${orgSlug}/templates`,
    templateLibrary: (orgSlug: string) => `/app/${orgSlug}/templates/library`,
    messages: (orgSlug: string) => `/app/${orgSlug}/messages`,
    settings: {
      root: (orgSlug: string) => `/app/${orgSlug}/settings`,
      organization: (orgSlug: string) => `/app/${orgSlug}/settings/organization`,
      team: (orgSlug: string) => `/app/${orgSlug}/settings/team`,
      whatsapp: (orgSlug: string) => `/app/${orgSlug}/settings/whatsapp`,
      meta: (orgSlug: string) => `/app/${orgSlug}/settings/meta`,
      billing: (orgSlug: string) => `/app/${orgSlug}/settings/billing`,
      profile: (orgSlug: string) => `/app/${orgSlug}/settings/profile`,
      security: (orgSlug: string) => `/app/${orgSlug}/settings/security`,
      webhooks: (orgSlug: string) => `/app/${orgSlug}/settings/webhooks`,
      apiKeys: (orgSlug: string) => `/app/${orgSlug}/settings/api-keys`,
    },
  },

  billing: {
    callback: '/billing/callback',
  },

  onboarding: {
    createOrganization: '/onboarding/create-organization',
    connectWhatsapp: '/onboarding/connect-whatsapp',
    selectPlan: '/onboarding/select-plan',
  },

  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    organizations: '/admin/organizations',
    organization: (id: string) => `/admin/organizations/${id}`,
    users: '/admin/users',
    user: (id: string) => `/admin/users/${id}`,
    plans: '/admin/plans',
    planNew: '/admin/plans/new',
    plan: (id: string) => `/admin/plans/${id}`,
    subscriptions: '/admin/subscriptions',
    system: {
      health: '/admin/system/health',
      monitoring: '/admin/system/monitoring',
    },
    auditLogs: '/admin/audit-logs',
    featureFlags: '/admin/feature-flags',
    announcements: '/admin/announcements',
    metaConfig: '/admin/meta-config',
    whop: '/admin/whop',
    settings: '/admin/settings',
  },

  errors: {
    forbidden: '/forbidden',
    notFound: '/404',
  },
} as const;

export const BILLING_ROUTE_PREFIX = '/billing';

export const PUBLIC_ROUTES = [ROUTES.errors.forbidden] as const;

export const GUEST_ROUTES = [
  ROUTES.auth.login,
  ROUTES.auth.register,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.resetPassword,
  ROUTES.auth.verifyEmail,
] as const;

export const PROTECTED_ROUTE_PREFIX = '/app';
export const ADMIN_ROUTE_PREFIX = '/admin';
export const ONBOARDING_ROUTE_PREFIX = '/onboarding';

export const AUTH_COOKIE_NAME = 'ghazala-auth';
export const ORG_COOKIE_NAME = 'ghazala-org-id';
