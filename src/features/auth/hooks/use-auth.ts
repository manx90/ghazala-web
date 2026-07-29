'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import { queryKeys } from '@/config/query';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';
import { ApiError } from '@/types/api.types';
import { getErrorMessage } from '@/utils/error';
import { toastSuccess, toastError } from '@/components/global/toast-helpers';

export function useCurrentUser(enabled = true) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: enabled && isAuthenticated,
    retry: (count, error) => {
      if (error instanceof ApiError && error.isUnauthorized) {
        return false;
      }
      return count < 1;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      return authApi.establishSession(response);
    },
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.setQueryData(queryKeys.auth.me, response.user);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      return authApi.establishSession(response);
    },
    onSuccess: (response) => {
      setUser(response.user);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearOrganization = useOrganizationStore((state) => state.clearOrganization);

  return useMutation({
    mutationFn: () => authApi.terminateSession(),
    onSettled: () => {
      clearAuth();
      clearOrganization();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
    onSuccess: (response) => {
      toastSuccess(response.message);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onSuccess: (response) => {
      toastSuccess(response.message);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
    onSuccess: (response) => {
      toastSuccess(response.message);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) => authApi.resendVerification(payload),
    onSuccess: (response) => {
      toastSuccess(response.message);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
