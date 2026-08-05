export const RESERVED_TEMPLATE_SLUGS = new Set([
  'library',
  'meta-library',
  'new',
  'languages',
  'sync',
]);

export function isReservedTemplateSlug(slug: string): boolean {
  return RESERVED_TEMPLATE_SLUGS.has(slug.toLowerCase());
}
