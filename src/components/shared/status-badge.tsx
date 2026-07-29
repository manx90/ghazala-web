import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  OPEN: { label: 'مفتوحة', variant: 'default' },
  CLOSED: { label: 'مغلقة', variant: 'secondary' },
  EXPIRED: { label: 'منتهية', variant: 'outline' },
  QUEUED: { label: 'في الانتظار', variant: 'outline' },
  SENDING: { label: 'جاري الإرسال', variant: 'outline' },
  SENT: { label: 'مُرسلة', variant: 'secondary' },
  DELIVERED: { label: 'مُسلّمة', variant: 'default' },
  READ: { label: 'مقروءة', variant: 'default' },
  FAILED: { label: 'فاشلة', variant: 'destructive' },
  APPROVED: { label: 'معتمد', variant: 'default' },
  PENDING: { label: 'قيد المراجعة', variant: 'outline' },
  REJECTED: { label: 'مرفوض', variant: 'destructive' },
  DRAFT: { label: 'مسودة', variant: 'secondary' },
  PAUSED: { label: 'موقوف', variant: 'outline' },
  DISABLED: { label: 'معطل', variant: 'destructive' },
  CONNECTED: { label: 'متصل', variant: 'default' },
  DISCONNECTED: { label: 'غير متصل', variant: 'destructive' },
  GREEN: { label: 'ممتاز', variant: 'default' },
  YELLOW: { label: 'متوسط', variant: 'outline' },
  RED: { label: 'ضعيف', variant: 'destructive' },
  ACTIVE: { label: 'نشط', variant: 'default' },
  SUSPENDED: { label: 'موقوف', variant: 'destructive' },
  OWNER: { label: 'مالك', variant: 'default' },
  ADMIN: { label: 'مدير', variant: 'secondary' },
  MEMBER: { label: 'عضو', variant: 'outline' },
  SUPER_ADMIN: { label: 'Super Admin', variant: 'default' },
  USER: { label: 'مستخدم', variant: 'outline' },
  PENDING_VERIFICATION: { label: 'بانتظار التحقق', variant: 'outline' },
  INACTIVE: { label: 'غير نشط', variant: 'secondary' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, variant: 'outline' as const };
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
