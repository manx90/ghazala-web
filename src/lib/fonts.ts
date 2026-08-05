import { IBM_Plex_Sans_Arabic } from 'next/font/google';

export const arabicFont = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});
