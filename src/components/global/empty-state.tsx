import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'animate-fade-in-up flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/80 bg-card/50 px-6 py-14 text-center',
        className,
      )}
    >
      {icon && (
        <div className="animate-float flex size-14 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10 [&_svg]:size-6">
          {icon}
        </div>
      )}
      <div className="flex max-w-md flex-col gap-1.5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyStateAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button onClick={onClick} variant="default">
      {children}
    </Button>
  );
}
