'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { env } from '@/config/env';
import { useNetworkAware } from '@/hooks/use-network-aware';

type SocketEventType =
  | 'message:new'
  | 'message:status'
  | 'conversation:new'
  | 'conversation:update'
  | 'notification:new'
  | 'admin:queue'
  | 'admin:worker'
  | 'admin:health';

interface SocketEvent {
  type: SocketEventType;
  payload: unknown;
  timestamp: number;
}

interface SocketContextValue {
  isEnabled: boolean;
  isConnected: boolean;
  isSupported: boolean;
  events: SocketEvent[];
  connect: () => void;
  disconnect: () => void;
  subscribe: (type: SocketEventType, handler: (event: SocketEvent) => void) => () => void;
  emit: (type: SocketEventType, payload: unknown) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

/**
 * ⚠️ Socket.IO / WebSocket غير متوفر في الـ backend حالياً.
 * هذا الـ Provider يوفّر بنية جاهزة للتكامل مع:
 *   - Socket.IO: io('${API_URL}')
 *   - WebSocket: new WebSocket('${wsUrl}/ws')
 *   - SSE: new EventSource('${API_URL}/events/stream')
 *
 * Endpoints المطلوبة في الـ backend:
 *   - WS /ws أو GET /events/stream
 *   - أحداث: message:new, message:status, conversation:new, conversation:update,
 *             notification:new, admin:queue, admin:worker, admin:health
 */
export function SocketProvider({ children }: SocketProviderProps) {
  const { isOnline } = useNetworkAware();
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<SocketEvent[]>([]);
  const handlersRef = useRef(new Map<SocketEventType, Set<(event: SocketEvent) => void>>());

  const subscribe = useCallback((type: SocketEventType, handler: (event: SocketEvent) => void) => {
    const handlers = handlersRef.current;
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type)!.add(handler);
    return () => handlers.get(type)?.delete(handler);
  }, []);

  const emit = useCallback((type: SocketEventType, payload: unknown) => {
    const event: SocketEvent = { type, payload, timestamp: Date.now() };
    setEvents((prev) => [...prev.slice(-50), event]);
    handlersRef.current.get(type)?.forEach((handler) => handler(event));
  }, []);

  const connect = useCallback(() => {
    if (!isOnline) return;
    setIsConnected(false);
    if (process.env.NODE_ENV === 'development') {
      console.info('[SocketProvider] Real-time غير متاح — backend endpoint مفقود (WS /ws أو GET /events/stream)');
    }
  }, [isOnline]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const value = useMemo<SocketContextValue>(
    () => ({
      isEnabled: false,
      isSupported: false,
      isConnected,
      events,
      connect,
      disconnect,
      subscribe,
      emit,
    }),
    [isConnected, events, connect, disconnect, subscribe, emit],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
}

export function getSocketUrl(): string {
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/api\/v\d+$/, '');
  return `${base.replace(/^http/, 'ws')}/ws`;
}
