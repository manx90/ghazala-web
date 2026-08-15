'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
} from '@/features/settings/hooks/use-settings-features';

export function ApiKeysManager() {
  const t = useTranslations('settings.apiKeys');
  const { data, isLoading } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t('nameRequired'));
      return;
    }

    try {
      const result = await createApiKey.mutateAsync({ name: name.trim() });
      setCreatedKey(result.key);
      toast.success(t('createSuccess'));
      setName('');
    } catch {
      toast.error(t('createError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApiKey.mutateAsync(id);
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('deleteError'));
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.success(t('copied'));
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button><PlusIcon className="size-4" />{t('create')}</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createTitle')}</DialogTitle>
              <DialogDescription>{t('createDescription')}</DialogDescription>
            </DialogHeader>
            {createdKey ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <p className="mb-2 text-sm font-medium text-green-600">{t('keyCreated')}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs" dir="ltr">
                      {createdKey}
                    </code>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(createdKey)}
                    >
                      {copiedKey ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{t('keyWarning')}</p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setCreatedKey(null);
                      setIsDialogOpen(false);
                    }}
                  >
                    {t('close')}
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">{t('nameLabel')}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleCreate} disabled={createApiKey.isPending}>
                    {createApiKey.isPending ? t('creating') : t('create')}
                  </Button>
                </DialogFooter>
              </>
            )}
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
          {items.map((key) => (
            <Card key={key.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <Badge variant={key.active ? 'default' : 'secondary'}>
                      {key.active ? t('active') : t('inactive')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {key.prefix && (
                      <code className="font-mono" dir="ltr">
                        {key.prefix}...
                      </code>
                    )}
                    <span>{t('createdAt')}: {new Date(key.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(key.id)}
                  disabled={deleteApiKey.isPending}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
