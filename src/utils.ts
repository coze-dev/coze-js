// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonParse(jsonString: string, defaultValue: any = '') {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}
