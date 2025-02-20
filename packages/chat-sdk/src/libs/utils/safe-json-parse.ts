export const safeJSONParse = <T>(
  v: T | string,
  defaultValue: T | null = null,
): T | null => {
  if (typeof v === 'object') {
    return v;
  }
  try {
    return JSON.parse(String(v));
  } catch (e) {
    return defaultValue;
  }
};
