'use client';

import { Building2Icon, CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import {
  useOrganizations,
  useSwitchOrganization,
} from '@/features/shell/hooks/use-organizations';
import Link from 'next/link';

function getOrgInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function OrganizationSwitcherComponent() {
  const { organizations, currentOrganization, isLoading } = useOrganizations();
  const switchOrganization = useSwitchOrganization();

  if (isLoading && !currentOrganization) {
    return <Skeleton className="h-8 w-40" />;
  }

  if (!currentOrganization) {
    return (
      <Button variant="outline" size="sm" render={<Link href={ROUTES.onboarding.createOrganization} />}>
        <PlusIcon data-icon="inline-start" />
        إنشاء منظمة
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="max-w-[220px] justify-between gap-2"
            aria-label="تبديل المنظمة"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <Avatar size="sm">
            {currentOrganization.logo && (
              <AvatarImage src={currentOrganization.logo} alt={currentOrganization.name} />
            )}
            <AvatarFallback>{getOrgInitials(currentOrganization.name)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{currentOrganization.name}</span>
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>المنظمات</DropdownMenuLabel>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              disabled={switchOrganization.isPending}
              onClick={() => {
                if (org.id !== currentOrganization.id) {
                  switchOrganization.mutate(org);
                }
              }}
            >
              <Building2Icon data-icon="inline-start" />
              <span className="flex-1 truncate">{org.name}</span>
              {org.id === currentOrganization.id && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={ROUTES.onboarding.createOrganization} />}>
          <PlusIcon data-icon="inline-start" />
          إنشاء منظمة
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const OrganizationSwitcher = memo(OrganizationSwitcherComponent);
