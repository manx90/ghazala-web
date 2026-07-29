export interface Contact {
  id: string;
  organizationId: string;
  phone: string;
  waId: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  profileName: string | null;
  profilePhotoUrl: string | null;
  email: string | null;
  notes: string | null;
  lastMessageAt: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContactListResponse {
  items: Contact[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateContactPayload {
  phone: string;
  waId?: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profilePhotoUrl?: string;
  email?: string;
  notes?: string;
}

export interface UpdateContactPayload {
  waId?: string;
  firstName?: string;
  lastName?: string;
  profileName?: string;
  profilePhotoUrl?: string;
  email?: string;
  notes?: string;
  isBlocked?: boolean;
}

export interface MergeContactsPayload {
  primaryContactId: string;
  duplicateContactId: string;
}

export interface MergeContactsResponse {
  contact: Contact;
  transferredConversations: number;
}
