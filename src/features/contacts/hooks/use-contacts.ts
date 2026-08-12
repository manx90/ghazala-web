'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { contactsApi } from '@/features/contacts/api/contacts.api';
import type {
  ContactQueryParams,
  CreateContactPayload,
  MergeContactsPayload,
  UpdateContactPayload,
} from '@/types/contact.types';

export function useContactsList(params?: ContactQueryParams) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params as Record<string, unknown> | undefined),
    queryFn: () => contactsApi.list(params),
  });
}

export function useContact(contactId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(contactId),
    queryFn: () => contactsApi.getById(contactId),
    enabled: enabled && !!contactId,
  });
}

export function useCreateContact() {
  const t = useTranslations('contacts');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactPayload) => contactsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toastSuccess(t('toast.created'));
    },
    onError: toastApiError,
  });
}

export function useUpdateContact(contactId: string) {
  const t = useTranslations('contacts');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContactPayload) => contactsApi.update(contactId, payload),
    onSuccess: (contact) => {
      queryClient.setQueryData(queryKeys.contacts.detail(contactId), contact);
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toastSuccess(t('toast.updated'));
    },
    onError: toastApiError,
  });
}

export function useDeleteContact() {
  const t = useTranslations('contacts');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => contactsApi.delete(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toastSuccess(t('toast.deleted'));
    },
    onError: toastApiError,
  });
}

export function useMergeContacts() {
  const t = useTranslations('contacts');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MergeContactsPayload) => contactsApi.merge(payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.setQueryData(queryKeys.contacts.detail(result.contact.id), result.contact);
      toastSuccess(t('toast.merged', { count: result.transferredConversations }));
    },
    onError: toastApiError,
  });
}
