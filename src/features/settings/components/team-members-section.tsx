'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PlusIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { QueryState } from '@/components/shared/query-state';
import {
  createAddTeamMemberSchema,
  type AddMemberFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useAddTeamMember,
  useRemoveTeamMember,
  useTeamMembers,
  useUpdateTeamMember,
} from '@/features/settings/hooks/use-settings';
import { OrganizationMemberRole } from '@/types/organization.types';
import type { OrganizationMember } from '@/types/member.types';
import { formatDate } from '@/utils/date';

const ROLE_VALUES = [
  OrganizationMemberRole.OWNER,
  OrganizationMemberRole.ADMIN,
  OrganizationMemberRole.MEMBER,
] as const;

export function TeamMembersSection() {
  const t = useTranslations('settings.team');
  const tValidation = useTranslations('settings.validation');
  const tCommon = useTranslations('common');
  const { data, isLoading, isError, error, refetch } = useTeamMembers();
  const addMember = useAddTeamMember();
  const updateMember = useUpdateTeamMember();
  const removeMember = useRemoveTeamMember();

  const [addOpen, setAddOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);

  const schema = useMemo(
    () => createAddTeamMemberSchema((k) => tValidation(k)),
    [tValidation],
  );

  const addForm = useForm<AddMemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: '',
      role: OrganizationMemberRole.MEMBER,
    },
  });

  const handleAddMember = addForm.handleSubmit(async (values) => {
    await addMember.mutateAsync(values);
    addForm.reset();
    setAddOpen(false);
  });

  const handleRoleChange = async (member: OrganizationMember, role: OrganizationMemberRole) => {
    if (member.role === role) return;
    await updateMember.mutateAsync({ id: member.id, payload: { role } });
  };

  const handleRemove = async () => {
    if (!memberToRemove) return;
    await removeMember.mutateAsync(memberToRemove.id);
    setMemberToRemove(null);
  };

  const removeName = memberToRemove
    ? `${memberToRemove.user.firstName} ${memberToRemove.user.lastName}`.trim()
    : '';

  return (
    <>
      <Card className="stagger-in">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <UsersIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setAddOpen(true)}>
            <PlusIcon />
            {t('addMember')}
          </Button>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={!data?.items.length}
            emptyTitle={t('emptyTitle')}
            emptyDescription={t('emptyDescription')}
            emptyAction={
              <Button variant="gradient" onClick={() => setAddOpen(true)}>
                <PlusIcon />
                {t('addMember')}
              </Button>
            }
            onRetry={() => void refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead>{t('columns.email')}</TableHead>
                  <TableHead>{t('columns.role')}</TableHead>
                  <TableHead>{t('columns.joinedAt')}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.user.firstName?.[0] ?? ''}
                            {member.user.lastName?.[0] ?? ''}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {member.user.firstName} {member.user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          void handleRoleChange(member, value as OrganizationMemberRole)
                        }
                        disabled={updateMember.isPending}
                      >
                        <SelectTrigger
                          size="sm"
                          className="rounded-full border-transparent bg-muted text-xs font-medium shadow-none hover:bg-accent"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_VALUES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {t(`roles.${role.toLowerCase()}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(member.joinedAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('removeDialog.ariaLabel')}
                        onClick={() => setMemberToRemove(member)}
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </QueryState>
        </CardContent>
      </Card>

      <ModalWrapper
        open={addOpen}
        onOpenChange={setAddOpen}
        title={t('addModal.title')}
        description={t('addModal.description')}
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button variant="gradient" onClick={() => void handleAddMember()} disabled={addMember.isPending}>
              {addMember.isPending && <Loader2Icon className="animate-spin" />}
              {tCommon('add')}
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-5" onSubmit={handleAddMember}>
          <div className="space-y-2">
            <Label htmlFor="userId">{t('addModal.userId')}</Label>
            <Input
              id="userId"
              dir="ltr"
              className="text-left font-mono text-xs"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              {...addForm.register('userId')}
              aria-invalid={Boolean(addForm.formState.errors.userId)}
            />
            {addForm.formState.errors.userId && (
              <p className="text-sm text-destructive">{addForm.formState.errors.userId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t('addModal.role')}</Label>
            <Select
              value={addForm.watch('role')}
              onValueChange={(value) =>
                addForm.setValue('role', value as OrganizationMemberRole, { shouldValidate: true })
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_VALUES.filter((r) => r !== OrganizationMemberRole.OWNER).map((role) => (
                  <SelectItem key={role} value={role}>
                    {t(`roles.${role.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </ModalWrapper>

      <DeleteDialog
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title={t('removeDialog.title')}
        description={t('removeDialog.description', { name: removeName })}
        confirmLabel={t('removeDialog.confirm')}
        onConfirm={() => void handleRemove()}
        isLoading={removeMember.isPending}
      />
    </>
  );
}
