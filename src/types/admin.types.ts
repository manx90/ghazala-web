import type { Organization } from '@/types/organization.types';
import type { User } from '@/types/auth.types';
import type { PaginationParams } from '@/types/pagination.types';
import type { Invoice, OrganizationUsage, Plan, Subscription, SubscriptionStatus } from '@/types/billing.types';
import type { UserRole, UserStatus } from '@/types/auth.types';

export interface AdminUserStats {
  total: number;
  active: number;
  disabled: number;
}

export interface AdminOrganizationStats {
  total: number;
  active: number;
  suspended: number;
}

export interface AdminPlatformStats {
  totalApiRequests: number;
  totalMessages: number;
}

export interface AdminDashboardResponse {
  users: AdminUserStats;
  organizations: AdminOrganizationStats;
  platform: AdminPlatformStats;
  generatedAt: string;
}

export interface AdminPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type AdminOrganizationListResponse = AdminPaginatedResponse<AdminOrganizationListItem>;

export interface AdminOrganizationPlanSummary {
  planName?: string;
  planCode?: string;
  subscriptionStatus?: SubscriptionStatus;
}

export interface AdminOrganizationListItem extends Organization {
  plan?: AdminOrganizationPlanSummary | null;
}

export interface AdminOrganizationListParams extends AdminPaginationParams {
  search?: string;
  status?: Organization['status'];
}

export interface AdminOrganizationUsageResponse {
  hasActiveSubscription: boolean;
  usage?: OrganizationUsage;
}

export interface AdminOrganizationSubscriptionResponse {
  hasSubscription: boolean;
  subscription?: Subscription;
}

export interface AdminOrganizationPhoneNumber {
  id: string;
  displayPhoneNumber: string | null;
  verifiedName: string | null;
  status: string;
  createdAt: string;
}

export interface AdminOrganizationPhoneNumberListResponse {
  items: AdminOrganizationPhoneNumber[];
  total: number;
}

export enum AdminOrganizationBulkAction {
  ACTIVATE = 'ACTIVATE',
  SUSPEND = 'SUSPEND',
}

export interface BulkAdminOrganizationPayload {
  action: AdminOrganizationBulkAction;
  ids: string[];
}

export interface UpdateAdminOrganizationPayload {
  name?: string;
  slug?: string;
  logo?: string | null;
  timezone?: string;
  country?: string;
}

export interface AdminUserListItem extends User {
  organizationsCount: number;
}

export type AdminUserListResponse = AdminPaginatedResponse<AdminUserListItem>;

export interface AdminUserListParams extends AdminPaginationParams {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  organizationId?: string;
}

export interface AdminUserOrganizationSummary {
  id: string;
  name: string;
  slug: string;
  status: Organization['status'];
}

export interface AdminUserOrganizationMembership {
  organization: AdminUserOrganizationSummary;
  role: string;
  joinedAt: string;
}

export interface AdminUserOrganizationsResponse {
  items: AdminUserOrganizationMembership[];
}

export type AdminPaginationParams = PaginationParams;

export interface AdminMessageResponse {
  message: string;
}

export interface HealthResponse {
  status: 'ok';
}

export interface CreatePlanPayload {
  name: string;
  code: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  isActive?: boolean;
  maxMessagesMonthly?: number | null;
  maxContacts?: number | null;
  maxTeamMembers?: number | null;
  maxPhoneNumbers?: number | null;
  whopPlanIdMonthly?: string | null;
  whopPlanIdYearly?: string | null;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string | null;
  monthlyPrice?: number;
  yearlyPrice?: number;
  currency?: string;
  isActive?: boolean;
  maxMessagesMonthly?: number | null;
  maxContacts?: number | null;
  maxTeamMembers?: number | null;
  maxPhoneNumbers?: number | null;
  whopPlanIdMonthly?: string | null;
  whopPlanIdYearly?: string | null;
}

export interface AdminSubscriptionOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface AdminSubscription extends Subscription {
  organization?: AdminSubscriptionOrganization;
  plan?: Plan;
}

export interface AdminSubscriptionListParams extends AdminPaginationParams {
  status?: SubscriptionStatus;
  planId?: string;
  search?: string;
}

export type AdminSubscriptionListResponse = AdminPaginatedResponse<AdminSubscription>;

export interface AdminSubscriptionDetail extends AdminSubscription {
  invoices: Invoice[];
}

export interface AdminSubscriptionStats {
  active: number;
  trial: number;
  pendingPayment: number;
  pastDue: number;
  cancelled: number;
  expired: number;
  mrr: string;
  currency: string;
}

export interface ExtendSubscriptionPayload {
  days: number;
}

export type AdminHealthStatus = 'ok' | 'degraded' | 'down' | 'not_configured';

export interface AdminHealthComponent {
  status: AdminHealthStatus;
  configured: boolean;
  latencyMs?: number;
  message?: string;
}

export interface AdminStorageHealth extends AdminHealthComponent {
  freeMemoryBytes?: number;
  totalMemoryBytes?: number;
  logPath?: string;
}

export interface AdminWabaStats {
  total: number;
  connected: number;
  disconnected: number;
  pending: number;
  restricted: number;
  organizationsWithWaba: number;
}

export interface AdminPhoneNumberStats {
  total: number;
  connected: number;
  disconnected: number;
}

export type AdminMessageStatsPeriod = 'today' | 'month';

export interface AdminMessageStats {
  period: AdminMessageStatsPeriod;
  total: number;
  outbound: number;
  inbound: number;
  failed: number;
  queued: number;
}

export interface AdminRevenueStats {
  mrr: string;
  currency: string;
  totalRevenue: string;
  revenueThisMonth: string;
  paidInvoices: number;
}

export interface AdminSubscriptionSummary extends AdminSubscriptionStats {
  total: number;
  byStatus: Record<SubscriptionStatus, number>;
}

export interface AdminQueueStatus {
  configured: boolean;
  waiting: number;
  active: number;
  failed: number;
  retryScheduled: number;
  completedToday: number;
}

export interface AdminWorkersStatus {
  configured: boolean;
  mode: 'in_process' | 'distributed';
  activeWorkers: number;
  status: 'running' | 'idle' | 'unavailable';
  message?: string;
}

export type AdminActivityType =
  | 'ORGANIZATION_CREATED'
  | 'USER_REGISTERED'
  | 'SUBSCRIPTION_CREATED'
  | 'INVOICE_PAID';

export interface AdminActivityItem {
  id: string;
  type: AdminActivityType;
  title: string;
  description?: string;
  occurredAt: string;
}

export interface AdminActivityTimeline {
  items: AdminActivityItem[];
  total: number;
}

export interface AdminWhopStatus {
  configured: boolean;
  sandbox: boolean;
  webhookSecretConfigured: boolean;
  companyIdConfigured: boolean;
  maskedApiKey: string | null;
  webhookUrl: string;
  companyId: string | null;
  warning: string | null;
}

export interface AdminWhopPlanItem {
  id: string;
  title: string;
  currency: string;
  renewalPrice: number;
  billingPeriod: number | null;
  planType: string;
  visibility: string;
}

export interface AdminWhopLocalPlanMapping {
  id: string;
  name: string;
  code: string;
  monthlyPrice: string;
  yearlyPrice: string;
  whopPlanIdMonthly: string | null;
  whopPlanIdYearly: string | null;
  isFullyMapped: boolean;
}

export interface AdminWhopPlanSuggestion {
  localPlanId: string;
  whopPlanId: string;
  billingCycle: 'monthly' | 'yearly';
  reason: string;
}

export interface AdminWhopPlansResponse {
  whopPlans: AdminWhopPlanItem[];
  localPlans: AdminWhopLocalPlanMapping[];
  suggestions: AdminWhopPlanSuggestion[];
  error: string | null;
}

export interface AdminWhopPaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string | null;
  substatus: string;
  createdAt: string;
  paidAt: string | null;
  planId: string | null;
  planTitle: string | null;
  memberEmail: string | null;
}

export interface AdminWhopPaymentsResponse {
  items: AdminWhopPaymentItem[];
  error: string | null;
}

export interface AdminWhopMembershipItem {
  id: string;
  status: string;
  createdAt: string;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  planId: string | null;
  planTitle: string | null;
  memberEmail: string | null;
}

export interface AdminWhopMembershipsResponse {
  items: AdminWhopMembershipItem[];
  error: string | null;
}

export interface AdminWhopWebhookEventItem {
  id: string;
  eventType: string;
  eventId: string;
  processedAt: string;
}

export interface AdminWhopWebhookEventsResponse {
  items: AdminWhopWebhookEventItem[];
}

export interface AdminWhopSyncPlanResponse {
  planId: string;
  whopProductId: string | null;
  whopPlanIdMonthly: string | null;
  whopPlanIdYearly: string | null;
}

export interface AdminWhopSyncAllResponse {
  synced: number;
  failed: number;
  results: Array<{ planId: string; ok: boolean; error?: string }>;
}

export interface AdminWhopPaymentActionResponse {
  id: string;
  status: string | null;
  substatus: string;
  message: string;
}

export interface AdminWhopMembershipActionResponse {
  id: string;
  status: string;
  message: string;
}

export interface AdminWhopCheckoutResponse {
  id: string;
  purchaseUrl: string | null;
  planId: string;
}

export interface AdminWhopPromoCodeItem {
  id: string;
  code: string | null;
  promoType: string;
  amountOff: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminWhopPromoCodesResponse {
  items: AdminWhopPromoCodeItem[];
}

export interface CreateAdminWhopPromoCodePayload {
  code: string;
  promoType: 'percentage' | 'flat_amount';
  amountOff: number;
  currency?: string;
  newUsersOnly: boolean;
  promoDurationMonths: number;
}

export interface AdminWhopWebhookItem {
  id: string;
  url: string;
  enabled: boolean;
  events: string[];
  createdAt: string;
}

export interface AdminWhopWebhooksListResponse {
  items: AdminWhopWebhookItem[];
}

export interface AdminWhopRegisterWebhookResponse {
  id: string;
  url: string;
  enabled: boolean;
  events: string[];
  message: string;
}
