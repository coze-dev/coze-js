import type { EnterMessage } from "./v2.js";

export function formatAddtionalMessages(
  additionalMessages: EnterMessage[] | undefined
) {
  const additional_messages: EnterMessage[] = [];
  if (Array.isArray(additionalMessages)) {
    for (const item of additionalMessages) {
      if (
        item.content_type === "object_string" &&
        Array.isArray(item.content)
      ) {
        additional_messages.push({
          ...item,
          content: JSON.stringify(item.content),
        });
      } else {
        additional_messages.push(item);
      }
    }
  }
  return additional_messages;
}
