'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, MailPlusIcon, Trash2Icon, UsersIcon, XCircleIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  createInviteTeamMemberSchema,
  type InviteMemberFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useInviteMember,
  useOrgInvites,
  useRemoveTeamMember,
  useRevokeInvite,
  useTeamMembers,
  useUpdateTeamMember,
} from '@/features/settings/hooks/use-settings';
import { OrganizationMemberRole } from '@/types/organization.types';
import type { OrganizationMember } from '@/types/member.types';
import type { OrganizationInvite } from '@/types/invite.types';
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
  const invites = useOrgInvites();
  const inviteMember = useInviteMember();
  const revokeInvite = useRevokeInvite();
  const updateMember = useUpdateTeamMember();
  const removeMember = useRemoveTeamMember();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);
  const [inviteToRevoke, setInviteToRevoke] = useState<OrganizationInvite | null>(null);

  const schema = useMemo(
    () => createInviteTeamMemberSchema((k) => tValidation(k)),
    [tValidation],
  );

  const inviteForm = useForm<InviteMemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      role: OrganizationMemberRole.MEMBER,
    },
  });

  const handleInvite = inviteForm.handleSubmit(async (values) => {
    await inviteMember.mutateAsync(values);
    inviteForm.reset();
    setInviteOpen(false);
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

  const handleRevoke = async () => {
    if (!inviteToRevoke) return;
    await revokeInvite.mutateAsync(inviteToRevoke.id);
    setInviteToRevoke(null);
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
          <Button variant="gradient" onClick={() => setInviteOpen(true)}>
            <MailPlusIcon />
            {t('inviteMember')}
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
              <Button variant="gradient" onClick={() => setInviteOpen(true)}>
                <MailPlusIcon />
                {t('inviteMember')}
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

      <Card className="stagger-in">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <MailPlusIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('invites.title')}</CardTitle>
              <CardDescription>{t('invites.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={invites.isLoading}
            isError={invites.isError}
            error={invites.error}
            isEmpty={!invites.data?.items.length}
            emptyTitle={t('invites.emptyTitle')}
            emptyDescription={t('invites.emptyDescription')}
            onRetry={() => void invites.refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.email')}</TableHead>
                  <TableHead>{t('columns.role')}</TableHead>
                  <TableHead>{t('invites.columns.sentAt')}</TableHead>
                  <TableHead>{t('invites.columns.expiresAt')}</TableHead>
                  <TableHead>{t('columns.status')}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.data?.items.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t(`roles.${invite.role.toLowerCase()}`)}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(invite.createdAt)}</TableCell>
                    <TableCell>{formatDate(invite.expiresAt)}</TableCell>
                    <TableCell>
                      <Badge variant={invite.status === 'pending' ? 'outline' : 'secondary'}>
                        {t(`invites.status.${invite.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('invites.revokeAria')}
                        onClick={() => setInviteToRevoke(invite)}
                      >
                        <XCircleIcon className="text-destructive" />
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
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={t('inviteModal.title')}
        description={t('inviteModal.description')}
        footer={
          <>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button variant="gradient" onClick={() => void handleInvite()} disabled={inviteMember.isPending}>
              {inviteMember.isPending && <Loader2Icon className="animate-spin" />}
              {t('inviteModal.send')}
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-5" onSubmit={handleInvite}>
          <div className="space-y-2">
            <Label htmlFor="email">{t('inviteModal.email')}</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              className="text-left"
              placeholder="name@company.com"
              {...inviteForm.register('email')}
              aria-invalid={Boolean(inviteForm.formState.errors.email)}
            />
            {inviteForm.formState.errors.email && (
              <p className="text-sm text-destructive">{inviteForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t('inviteModal.role')}</Label>
            <Select
              value={inviteForm.watch('role')}
              onValueChange={(value) =>
                inviteForm.setValue('role', value as InviteMemberFormValues['role'], {
                  shouldValidate: true,
                })
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

      <DeleteDialog
        open={Boolean(inviteToRevoke)}
        onOpenChange={(open) => !open && setInviteToRevoke(null)}
        title={t('invites.revokeDialog.title')}
        description={t('invites.revokeDialog.description', { email: inviteToRevoke?.email ?? '' })}
        confirmLabel={t('invites.revokeDialog.confirm')}
        onConfirm={() => void handleRevoke()}
        isLoading={revokeInvite.isPending}
      />
    </>
  );
}
