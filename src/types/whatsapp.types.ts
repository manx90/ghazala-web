export enum WhatsappAccountStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  PENDING = 'PENDING',
  RESTRICTED = 'RESTRICTED',
}

export enum PhoneQualityRating {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
  UNKNOWN = 'UNKNOWN',
}

export interface WhatsappBusinessAccount {
  id: string;
  organizationId: string;
  metaBusinessId: string | null;
  wabaId: string;
  name: string | null;
  timezone: string | null;
  currency: string | null;
  status: WhatsappAccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappBusinessAccountListResponse {
  items: WhatsappBusinessAccount[];
  total: number;
}

export interface PhoneNumber {
  id: string;
  organizationId: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string | null;
  qualityRating: PhoneQualityRating;
  codeVerificationStatus: string | null;
  platformType: string | null;
  messagingLimitTier: string | null;
  status: WhatsappAccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumberListResponse {
  items: PhoneNumber[];
  total: number;
}

export interface WhatsappSyncResult {
  wabasSynced: number;
  phoneNumbersSynced: number;
}
