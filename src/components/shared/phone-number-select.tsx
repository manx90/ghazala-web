'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { queryKeys } from '@/config/query-keys';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { Skeleton } from '@/components/ui/skeleton';

interface PhoneNumberSelectProps {
  value?: string;
  onChange: (phoneNumberId: string) => void;
  className?: string;
}

export function PhoneNumberSelect({ value, onChange, className }: PhoneNumberSelectProps) {
  const t = useTranslations('common.forms');
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.whatsapp.phoneNumbers,
    queryFn: () => whatsappApi.listPhoneNumbers(),
  });

  if (isLoading) return <Skeleton className="h-9 w-48" />;

  if (isError || !data?.items.length) {
    return (
      <Select value="" disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder={t('noPhoneNumbers')} />
        </SelectTrigger>
      </Select>
    );
  }

  const selected = value ?? data.items[0]?.phoneNumberId;

  return (
    <Select
      value={selected}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
    >
      <SelectTrigger className={className} aria-label={t('selectWhatsappPhone')}>
        <SelectValue placeholder={t('selectPhone')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data.items.map((phone) => (
            <SelectItem key={phone.id} value={phone.phoneNumberId}>
              {phone.displayPhoneNumber}
              {phone.verifiedName ? ` (${phone.verifiedName})` : ''}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function usePhoneNumbers() {
  return useQuery({
    queryKey: queryKeys.whatsapp.phoneNumbers,
    queryFn: () => whatsappApi.listPhoneNumbers(),
  });
}
