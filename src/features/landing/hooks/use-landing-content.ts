'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ROUTES } from '@/config/routes';
import {
  FEATURE_ITEMS,
  FOOTER_LINK_GROUPS,
  HERO_STATS,
  LANDING_NAV_LINKS,
  PRODUCT_KPI_KEYS,
  PRODUCT_SIDEBAR_ITEMS,
  SECURITY_BADGE_KEYS,
  SPLIT_SECTION_CONFIG,
} from '../data/landing-content';

export function useLandingContent() {
  const t = useTranslations('landing');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');

  return useMemo(() => {
    const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;
    const trustedItems = t.raw('trustedBy.items') as string[];
    const pricingPoints = t.raw('pricing.points') as string[];
    const chatMessages = t.raw('heroVisual.chat') as Array<{
      from: string;
      text: string;
      time: string;
    }>;

    return {
      navLinks: LANDING_NAV_LINKS.map((link) => ({
        href: link.href,
        label: t(`nav.${link.key}`),
      })),
      hero: {
        badge: t('hero.badge'),
        titleBefore: t('hero.titleBefore'),
        titleHighlight: t('hero.titleHighlight'),
        titleAfter: t('hero.titleAfter'),
        description: t('hero.description'),
        primaryCta: { label: t('hero.primaryCta'), href: ROUTES.auth.register },
        secondaryCta: { label: t('hero.secondaryCta'), href: '#features' },
        stats: HERO_STATS.map((stat) => ({
          value: stat.value,
          label: t(`hero.stats.${stat.labelKey}`),
        })),
      },
      securityBadges: SECURITY_BADGE_KEYS.map((badge) => ({
        icon: badge.icon,
        label: t(`securityBadges.${badge.key}`),
      })),
      trustedBy: {
        title: t('trustedBy.title'),
        items: trustedItems,
      },
      featuresGrid: {
        id: 'features',
        eyebrow: t('featuresGrid.eyebrow'),
        title: t('featuresGrid.title'),
        description: t('featuresGrid.description'),
        items: FEATURE_ITEMS.map((item) => ({
          icon: item.icon,
          title: t(`featuresGrid.items.${item.key}.title`),
          description: t(`featuresGrid.items.${item.key}.description`),
        })),
      },
      splitSections: SPLIT_SECTION_CONFIG.map((section) => {
        const points = t.raw(`splitSections.${section.key}.points`) as string[];
        return {
          id: section.id,
          icon: section.icon,
          visual: section.visual,
          eyebrow: t(`splitSections.${section.key}.eyebrow`),
          title: t(`splitSections.${section.key}.title`),
          description: t(`splitSections.${section.key}.description`),
          points,
        };
      }),
      pricing: {
        eyebrow: t('pricing.eyebrow'),
        title: t('pricing.title'),
        description: t('pricing.description'),
        primaryCta: { label: t('pricing.primaryCta'), href: ROUTES.auth.register },
        points: pricingPoints,
      },
      faq: {
        id: 'faq',
        eyebrow: t('faq.eyebrow'),
        title: t('faq.title'),
        items: faqItems,
      },
      footer: {
        brandName: tCommon('appName'),
        description: t('footer.description'),
        columns: FOOTER_LINK_GROUPS.map((group) => ({
          title: t(`footer.columns.${group.columnKey}`),
          links: group.links.map((link) => ({
            href: link.href,
            label:
              group.columnKey === 'account'
                ? link.labelKey === 'login'
                  ? tAuth('login')
                  : tAuth('register')
                : group.columnKey === 'legal'
                  ? t(`footer.links.${link.labelKey}`)
                  : t(`nav.${link.labelKey}`),
          })),
        })),
        copyright: `© ${new Date().getFullYear()} ${tCommon('appName')}. ${t('footer.copyright')}`,
      },
      productShowcase: {
        eyebrow: t('productShowcase.eyebrow'),
        title: t('productShowcase.title'),
        description: t('productShowcase.description'),
        sidebar: PRODUCT_SIDEBAR_ITEMS.map((item) => ({
          icon: item.icon,
          label: t(`productShowcase.sidebar.${item.key}`),
          active: item.active,
        })),
        kpis: PRODUCT_KPI_KEYS.map((kpi) => ({
          label: t(`productShowcase.kpis.${kpi.key}`),
          value: t(`productShowcase.kpiValues.${kpi.key}`),
        })),
        chartTitle: t('productShowcase.chartTitle'),
        chartGrowth: t('productShowcase.chartGrowth'),
      },
      heroVisual: {
        channelTitle: t('heroVisual.channelTitle'),
        online: t('heroVisual.online'),
        readMessages: t('heroVisual.readMessages'),
        chat: chatMessages,
        senders: {
          bot: t('heroVisual.senders.bot'),
          agent: t('heroVisual.senders.agent'),
        },
        broadcastCampaign: t('heroVisual.broadcastCampaign'),
        delivered: t('heroVisual.delivered'),
        readRate: t('heroVisual.readRate'),
        autoReply: t('heroVisual.autoReply'),
      },
    };
  }, [t, tAuth, tCommon]);
}
