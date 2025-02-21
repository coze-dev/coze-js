export const safeJSONParse = <T, T2>(
  v: T | string,
  defaultValue: T2 | T | null = null,
): T | T2 | null => {
  if (typeof v === 'object') {
    return v;
  }
  try {
    return JSON.parse(String(v));
  } catch (e) {
    return defaultValue;
  }
};
