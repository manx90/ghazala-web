import type { ReactNode } from 'react';
import {
  DatabaseIcon,
  InboxIcon,
  UsersIcon,
  FileTextIcon,
  Building2Icon,
  BellIcon,
  SearchXIcon,
  WifiOffIcon,
  PackageXIcon,
} from 'lucide-react';
import { EmptyState, EmptyStateAction } from '@/components/global/empty-state';

interface EmptyStatePresetProps {
  action?: ReactNode;
  className?: string;
}

export function NoDataEmpty({ title = 'لا توجد بيانات', description, action }: EmptyStatePresetProps & { title?: string; description?: string }) {
  return (
    <EmptyState
      icon={<DatabaseIcon className="size-10" />}
      title={title}
      description={description}
      action={action}
      className={undefined}
    />
  );
}

export function NoSearchResultsEmpty({ query, action }: EmptyStatePresetProps & { query?: string }) {
  return (
    <EmptyState
      icon={<SearchXIcon className="size-10" />}
      title="لا توجد نتائج"
      description={query ? `لم نجد نتائج مطابقة لـ "${query}"` : 'جرّب تعديل معايير البحث'}
      action={action}
    />
  );
}

export function NoMessagesEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<InboxIcon className="size-10" />}
      title="لا توجد رسائل"
      description="ستظهر الرسائل هنا عند بدء المحادثات"
      action={action}
    />
  );
}

export function NoContactsEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<UsersIcon className="size-10" />}
      title="لا توجد جهات اتصال"
      description="أضف جهة اتصال جديدة لبدء المحادثة"
      action={action}
    />
  );
}

export function NoTemplatesEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<FileTextIcon className="size-10" />}
      title="لا توجد قوالب"
      description="أنشئ قالب رسالة معتمد من WhatsApp"
      action={action}
    />
  );
}

export function NoOrganizationsEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<Building2Icon className="size-10" />}
      title="لا توجد منظمات"
      description="لم يتم تسجيل أي منظمة بعد"
      action={action}
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={<BellIcon className="size-10" />}
      title="لا توجد إشعارات"
      description="كل الإشعارات ستظهر هنا"
    />
  );
}

export function OfflineEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<WifiOffIcon className="size-10" />}
      title="أنت غير متصل"
      description="تحقق من اتصال الإنترنت وحاول مجدداً"
      action={action}
    />
  );
}

export function GenericEmpty({ action }: EmptyStatePresetProps) {
  return (
    <EmptyState
      icon={<PackageXIcon className="size-10" />}
      title="لا يوجد محتوى"
      action={action}
    />
  );
}

export { EmptyStateAction };
