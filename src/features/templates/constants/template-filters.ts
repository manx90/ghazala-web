export const TEMPLATE_LANGUAGE_OPTIONS = [
  { value: 'ar', label: 'العربية (ar)' },
  { value: 'en_US', label: 'English US (en_US)' },
  { value: 'en_GB', label: 'English UK (en_GB)' },
  { value: 'fr', label: 'Français (fr)' },
  { value: 'es', label: 'Español (es)' },
  { value: 'de', label: 'Deutsch (de)' },
  { value: 'it', label: 'Italiano (it)' },
  { value: 'pt_BR', label: 'Português BR (pt_BR)' },
  { value: 'tr', label: 'Türkçe (tr)' },
  { value: 'ur', label: 'اردو (ur)' },
] as const;

export function getLanguageLabel(code: string): string {
  return TEMPLATE_LANGUAGE_OPTIONS.find((item) => item.value === code)?.label ?? code;
}

export const LIBRARY_TOPIC_OPTIONS = [
  { value: 'ALL', label: 'كل المواضيع' },
  { value: 'ORDER_MANAGEMENT', label: 'إدارة الطلبات' },
  { value: 'PAYMENTS', label: 'المدفوعات' },
  { value: 'ACCOUNT_UPDATE', label: 'تحديثات الحساب' },
  { value: 'CUSTOMER_FEEDBACK', label: 'تقييم العملاء' },
] as const;

export const LIBRARY_USECASE_OPTIONS = [
  { value: 'ALL', label: 'كل الاستخدامات' },
  { value: 'ORDER_CONFIRMATION', label: 'تأكيد الطلب' },
  { value: 'ORDER_DELAY', label: 'تأخير الطلب' },
  { value: 'ORDER_PICK_UP', label: 'استلام الطلب' },
  { value: 'SHIPMENT_CONFIRMATION', label: 'تأكيد الشحن' },
  { value: 'DELIVERY_UPDATE', label: 'تحديث التسليم' },
  { value: 'DELIVERY_CONFIRMATION', label: 'تأكيد التسليم' },
  { value: 'DELIVERY_FAILED', label: 'فشل التسليم' },
  { value: 'PAYMENT_CONFIRMATION', label: 'تأكيد الدفع' },
  { value: 'PAYMENT_DUE_REMINDER', label: 'تذكير الدفع' },
  { value: 'RETURN_CONFIRMATION', label: 'تأكيد الإرجاع' },
  { value: 'FEEDBACK_SURVEY', label: 'استبيان رضا' },
] as const;

export const LIBRARY_INDUSTRY_OPTIONS = [
  { value: 'ALL', label: 'كل القطاعات' },
  { value: 'E_COMMERCE', label: 'تجارة إلكترونية' },
  { value: 'FINANCIAL_SERVICES', label: 'خدمات مالية' },
] as const;
