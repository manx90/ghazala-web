'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  OPEN: 'default',
  CLOSED: 'secondary',
  EXPIRED: 'outline',
  QUEUED: 'outline',
  SENDING: 'outline',
  SENT: 'secondary',
  DELIVERED: 'default',
  READ: 'default',
  FAILED: 'destructive',
  APPROVED: 'default',
  PENDING: 'outline',
  REJECTED: 'destructive',
  PAID: 'default',
  VOID: 'secondary',
  DRAFT: 'secondary',
  PAUSED: 'outline',
  DISABLED: 'destructive',
  CONNECTED: 'default',
  DISCONNECTED: 'destructive',
  GREEN: 'default',
  YELLOW: 'outline',
  RED: 'destructive',
  ACTIVE: 'default',
  TRIAL: 'secondary',
  PAST_DUE: 'destructive',
  PENDING_PAYMENT: 'outline',
  CANCELLED: 'secondary',
  SUSPENDED: 'destructive',
  OWNER: 'default',
  ADMIN: 'secondary',
  MEMBER: 'outline',
  SUPER_ADMIN: 'default',
  USER: 'outline',
  PENDING_VERIFICATION: 'outline',
  INACTIVE: 'secondary',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('status');
  const variant = STATUS_VARIANTS[status] ?? 'outline';
  const label = t.has(status as never) ? t(status as never) : status;

  return (
    <Badge variant={variant} className={cn('gap-1.5', className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </Badge>
  );
}
