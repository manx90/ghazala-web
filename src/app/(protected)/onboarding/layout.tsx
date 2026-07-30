'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  Building2Icon,
  CheckIcon,
  CreditCardIcon,
  MessageCircleIcon,
  type LucideIcon,
} from 'lucide-react';
import { AuthGuard } from '@/components/guards/auth-guard';
import { OnboardingStepGuard } from '@/components/guards/onboarding-step-guard';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const STEPS: { id: string; label: string; path: string; icon: LucideIcon }[] = [
  { id: 'create-organization', label: 'إنشاء المنظمة', path: ROUTES.onboarding.createOrganization, icon: Building2Icon },
  { id: 'connect-whatsapp', label: 'ربط واتساب', path: ROUTES.onboarding.connectWhatsapp, icon: MessageCircleIcon },
  { id: 'select-plan', label: 'اختيار الخطة', path: ROUTES.onboarding.selectPlan, icon: CreditCardIcon },
];

function OnboardingStepper() {
  const pathname = usePathname();
  const currentIndex = Math.max(
    STEPS.findIndex((step) => pathname.startsWith(step.path)),
    0,
  );

  return (
    <ol aria-label="خطوات التسجيل" className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const completed = index < currentIndex;
        const current = index === currentIndex;

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3" aria-current={current ? 'step' : undefined}>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                  completed && 'bg-gradient-brand text-primary-foreground shadow-md',
                  current && 'bg-gradient-brand glow-brand text-primary-foreground shadow-lg ring-4 ring-primary/15',
                  !completed && !current && 'glass text-muted-foreground',
                )}
              >
                {completed ? (
                  <CheckIcon className="size-4" aria-hidden="true" />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-medium sm:block',
                  current ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'h-px w-8 rounded-full sm:w-16',
                  index < currentIndex ? 'bg-gradient-brand' : 'bg-border',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <AuthGuard>
      <OnboardingStepGuard>
        <div className="relative min-h-svh overflow-hidden">
          {/* خلفية شبكية مع توهجات ناعمة */}
          <div
            aria-hidden="true"
            className="bg-grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="animate-float absolute -top-32 start-1/4 size-96 rounded-full bg-primary/10 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="animate-float absolute bottom-0 end-0 size-80 rounded-full bg-secondary/10 blur-[100px]"
          />

          <div className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 py-8 sm:px-8">
            <header className="animate-fade-in-down flex items-center justify-center gap-2.5">
              <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-md">
                <MessageCircleIcon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight">غزالة</span>
            </header>

            <div className="animate-fade-in-up mt-8">
              <OnboardingStepper />
            </div>

            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </div>
      </OnboardingStepGuard>
    </AuthGuard>
  );
}
