import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  full: 'max-w-none',
};

export function PageContainer({
  children,
  className,
  size = 'lg',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'animate-fade-in mx-auto w-full flex-1 px-4 py-6 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
