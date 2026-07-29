export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  VOID = 'VOID',
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  monthlyPrice: string;
  yearlyPrice: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanListResponse {
  items: Plan[];
  total: number;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startsAt: string;
  expiresAt: string | null;
  cancelledAt: string | null;
  plan?: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  subscriptionId: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  paidAt: string | null;
  createdAt: string;
}

export interface InvoiceListResponse {
  items: Invoice[];
  total: number;
}

export interface SubscribePayload {
  planId: string;
  billingCycle: BillingCycle;
}

export interface ChangePlanPayload {
  planId: string;
  billingCycle: BillingCycle;
}
