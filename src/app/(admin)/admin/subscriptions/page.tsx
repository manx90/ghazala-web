import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminSubscriptionsPage() {
  return (
    <AdminUnavailablePage
      title="الاشتراكات"
      description="إدارة اشتراكات المنظمات على مستوى المنصة"
      requiredEndpoints={[
        'GET /admin/subscriptions?status=active|expired|cancelled|trial',
        'GET /admin/subscriptions/:id',
        'PATCH /admin/subscriptions/:id/renew',
        'GET /admin/subscriptions/:id/billing-status',
        'GET /admin/subscriptions/:id/payment-history',
      ]}
    />
  );
}
