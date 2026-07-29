import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  label = 'جاري التحميل...',
  className,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 bg-background text-foreground',
        fullScreen && 'min-h-svh',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2Icon className="size-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
