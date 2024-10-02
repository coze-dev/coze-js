import type { EnterMessage } from './v2.js';

export function formatAddtionalMessages(additionalMessages: EnterMessage[] | undefined): EnterMessage[] {
  if (!Array.isArray(additionalMessages)) {
    return [];
  }

  return additionalMessages.map((item: EnterMessage): EnterMessage => {
    if (item.content_type === 'object_string' && Array.isArray(item.content)) {
      return {
        ...item,
        content: JSON.stringify(item.content),
      };
    }
    return item;
  });
}

export function safeJsonParse(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return '';
  }
}
