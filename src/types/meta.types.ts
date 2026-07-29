export enum MetaIntegrationStatus {
  PENDING = 'PENDING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  EXPIRED = 'EXPIRED',
}

export interface MetaIntegration {
  id: string;
  organizationId: string;
  metaBusinessId: string;
  wabaId: string;
  systemUserId: string | null;
  status: MetaIntegrationStatus;
  connectedAt: string | null;
  disconnectedAt: string | null;
  lastSyncAt: string | null;
  tokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmbeddedSignupSession {
  appId: string;
  graphApiVersion: string;
  embeddedSignupConfigId?: string;
}

export interface MetaStatusResponse {
  integration: MetaIntegration | null;
  isConnected: boolean;
  embeddedSignupSession?: EmbeddedSignupSession;
}

export interface ConnectMetaPayload {
  authorizationCode?: string;
  metaBusinessId?: string;
  wabaId: string;
  systemUserId?: string;
  accessToken?: string;
  tokenExpiresAt?: string;
}
