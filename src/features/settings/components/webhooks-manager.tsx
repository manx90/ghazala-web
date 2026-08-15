'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useWebhookEndpoints,
  useCreateWebhookEndpoint,
  useUpdateWebhookEndpoint,
  useDeleteWebhookEndpoint,
} from '@/features/settings/hooks/use-settings-features';
import type { WebhookEvent } from '@/types/feature.types';

const AVAILABLE_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: 'message.received', label: 'Message Received' },
  { value: 'message.status.updated', label: 'Message Status Updated' },
  { value: 'template.status.updated', label: 'Template Status Updated' },
  { value: 'phone_number.quality.updated', label: 'Phone Number Quality' },
  { value: 'account.updated', label: 'Account Updated' },
  { value: 'history.synced', label: 'History Synced' },
  { value: 'contact.synced', label: 'Contact Synced' },
];

export function WebhooksManager() {
  const t = useTranslations('settings.webhooks');
  const { data, isLoading } = useWebhookEndpoints();
  const createWebhook = useCreateWebhookEndpoint();
  const updateWebhook = useUpdateWebhookEndpoint();
  const deleteWebhook = useDeleteWebhookEndpoint();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>(['message.received']);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!url.trim()) {
      toast.error(t('urlRequired'));
      return;
    }

    try {
      await createWebhook.mutateAsync({
        url: url.trim(),
        description: description.trim() || undefined,
        events: selectedEvents,
      });
      toast.success(t('createSuccess'));
      setUrl('');
      setDescription('');
      setSelectedEvents(['message.received']);
      setIsDialogOpen(false);
    } catch {
      toast.error(t('createError'));
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updateWebhook.mutateAsync({ id, payload: { active } });
      toast.success(active ? t('activated') : t('deactivated'));
    } catch {
      toast.error(t('updateError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWebhook.mutateAsync(id);
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('deleteError'));
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSecret(id);
    setTimeout(() => setCopiedSecret(null), 2000);
    toast.success(t('secretCopied'));
  };

  const toggleEvent = (event: WebhookEvent) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button><PlusIcon className="size-4" />{t('create')}</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createTitle')}</DialogTitle>
              <DialogDescription>{t('createDescription')}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="url">{t('urlLabel')}</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">{t('descriptionLabel')}</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('eventsLabel')}</Label>
                <div className="flex flex-col gap-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <label key={event.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.value)}
                        onChange={() => toggleEvent(event.value)}
                        className="size-4"
                      />
                      <span className="text-sm">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleCreate} disabled={createWebhook.isPending}>
                {createWebhook.isPending ? t('creating') : t('create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('empty')}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="flex flex-col gap-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{webhook.url}</span>
                      <Badge variant={webhook.active ? 'default' : 'secondary'}>
                        {webhook.active ? t('active') : t('inactive')}
                      </Badge>
                    </div>
                    {webhook.description && (
                      <p className="text-sm text-muted-foreground">{webhook.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={webhook.active}
                      onCheckedChange={(checked) => handleToggleActive(webhook.id, checked)}
                      disabled={updateWebhook.isPending}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(webhook.id)}
                      disabled={deleteWebhook.isPending}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                  <code className="flex-1 font-mono text-xs" dir="ltr">
                    {webhook.secret}
                  </code>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(webhook.secret, webhook.id)}
                  >
                    {copiedSecret === webhook.id ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
