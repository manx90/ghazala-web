'use client';

import type { ReactNode } from 'react';
import { GuestGuard } from '@/components/guards/guest-guard';

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return <GuestGuard>{children}</GuestGuard>;
}
