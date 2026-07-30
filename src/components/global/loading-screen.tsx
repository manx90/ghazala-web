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
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute size-14 animate-ping rounded-2xl bg-primary/10"
        />
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg glow-brand">
          <Loader2Icon className="size-6 animate-spin text-white" aria-hidden="true" />
        </span>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
