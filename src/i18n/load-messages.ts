type Messages = Record<string, unknown>;

const NAMESPACES = [
  'common',
  'nav',
  'auth',
  'validation',
  'status',
  'theme',
  'dialogs',
  'onboarding',
  'dashboard',
  'inbox',
  'contacts',
  'templates',
  'messages',
  'settings',
  'admin',
  'legal',
  'errors',
  'landing',
  'invite',
] as const;

function isPlainObject(value: unknown): value is Messages {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(base: Messages, patch: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export async function loadMessages(locale: string): Promise<Messages> {
  let messages: Messages = {};

  try {
    const root = (await import(`../../messages/${locale}.json`)).default as Messages;
    messages = deepMerge(messages, root);
  } catch {
    // root locale file optional when using split namespaces
  }

  for (const namespace of NAMESPACES) {
    try {
      const chunk = (await import(`../../messages/${locale}/${namespace}.json`)).default as Messages;
      messages = deepMerge(messages, { [namespace]: chunk });
    } catch {
      // namespace file not created yet
    }
  }

  return messages;
}
