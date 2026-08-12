import fs from 'fs';

const src = fs.readFileSync('src/features/legal/data/legal-content.ts', 'utf8');
const termsMatch = src.match(/export const TERMS_CONTENT: LegalDocument = (\{[\s\S]*?\n\});/);
const privacyMatch = src.match(/export const PRIVACY_CONTENT: LegalDocument = (\{[\s\S]*?\n\});/);
const terms = new Function('return ' + termsMatch[1])();
const privacy = new Function('return ' + privacyMatch[1])();

const arLegal = {
  homeAriaLabel: 'غزالة - الصفحة الرئيسية',
  lastUpdated: 'آخر تحديث: {date}',
  tocAriaLabel: 'فهرس المحتويات',
  tocTitle: 'محتويات الصفحة',
  footerCopyright: '© {year} غزالة. جميع الحقوق محفوظة.',
  termsLink: 'شروط الخدمة',
  privacyLink: 'سياسة الخصوصية',
  terms: {
    ...terms,
    metaTitle: 'شروط الخدمة',
    metaDescription:
      'الشروط والأحكام المنظمة لاستخدام منصة غزالة للتواصل عبر WhatsApp Business API.',
  },
  privacy: {
    ...privacy,
    metaTitle: 'سياسة الخصوصية',
    metaDescription: 'كيف تجمع منصة غزالة بياناتك وتستخدمها وتحميها.',
  },
};

fs.mkdirSync('messages/ar', { recursive: true });
fs.writeFileSync('messages/ar/legal.json', JSON.stringify(arLegal, null, 2), 'utf8');
console.log('Generated messages/ar/legal.json');
