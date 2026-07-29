export function generateSlugFromName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (slug.length >= 3) return slug.slice(0, 100);

  const suffix = Date.now().toString(36);
  return `org-${suffix}`.slice(0, 100);
}
