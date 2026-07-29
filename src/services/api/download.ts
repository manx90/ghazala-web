import type { AxiosResponse } from 'axios';

export interface DownloadOptions {
  filename?: string;
  mimeType?: string;
}

export function extractFilenameFromHeaders(
  contentDisposition: string | undefined,
  fallback: string,
): string {
  if (!contentDisposition) return fallback;

  const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  if (!match?.[1]) return fallback;

  try {
    return decodeURIComponent(match[1].replace(/"/g, ''));
  } catch {
    return match[1].replace(/"/g, '') || fallback;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadFromResponse(
  response: AxiosResponse<Blob>,
  options: DownloadOptions = {},
): Promise<void> {
  const contentDisposition = response.headers['content-disposition'] as string | undefined;
  const filename = extractFilenameFromHeaders(
    contentDisposition,
    options.filename ?? 'download',
  );

  const blob = new Blob([response.data], {
    type:
      options.mimeType ??
      (typeof response.headers['content-type'] === 'string'
        ? response.headers['content-type']
        : 'application/octet-stream'),
  });

  downloadBlob(blob, filename);
}

export async function blobToText(blob: Blob): Promise<string> {
  return blob.text();
}
