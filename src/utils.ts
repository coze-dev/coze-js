export function safeJsonParse(jsonString: string, defaultValue = '') {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}
