import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Organization } from '@/types/organization.types';

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  setCurrentOrganization: (organization: Organization | null) => void;
  setOrganizations: (organizations: Organization[]) => void;
  setLoading: (loading: boolean) => void;
  clearOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganization: null,
      organizations: [],
      isLoading: false,

      setCurrentOrganization: (currentOrganization) => set({ currentOrganization }),

      setOrganizations: (organizations) => set({ organizations }),

      setLoading: (isLoading) => set({ isLoading }),

      clearOrganization: () =>
        set({
          currentOrganization: null,
          organizations: [],
          isLoading: false,
        }),
    }),
    {
      name: 'ghazala-organization-store',
      partialize: (state) => ({
        currentOrganization: state.currentOrganization,
      }),
    },
  ),
);
