'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { queryKeys } from '@/config/query-keys';
import type {
  WebhookEndpointListResponse,
  CreateWebhookEndpointPayload,
  UpdateWebhookEndpointPayload,
  ApiKeyListResponse,
  CreateApiKeyPayload,
  ApiKeyCreated,
  SessionInfo,
} from '@/types/feature.types';

export function useWebhookEndpoints() {
  return useQuery({
    queryKey: queryKeys.settings.webhooks,
    queryFn: () => apiClient.get<WebhookEndpointListResponse>('/webhooks'),
  });
}

export function useCreateWebhookEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWebhookEndpointPayload) =>
      apiClient.post('/webhooks', payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.webhooks });
    },
  });
}

export function useUpdateWebhookEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWebhookEndpointPayload }) =>
      apiClient.patch(`/webhooks/${id}`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.webhooks });
    },
  });
}

export function useDeleteWebhookEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/webhooks/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.webhooks });
    },
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: queryKeys.settings.apiKeys,
    queryFn: () => apiClient.get<ApiKeyListResponse>('/api-keys'),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) =>
      apiClient.post<ApiKeyCreated>('/api-keys', payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.apiKeys });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api-keys/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.apiKeys });
    },
  });
}

export function useUserSessions() {
  return useQuery({
    queryKey: queryKeys.settings.sessions,
    queryFn: () => apiClient.get<SessionInfo[]>('/auth/me/sessions'),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.delete(`/auth/me/sessions/${sessionId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.sessions });
    },
  });
}
