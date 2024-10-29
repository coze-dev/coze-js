/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function safeJsonParse(jsonString: string, defaultValue: any = '') {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

export function mergeConfig(...objects: any[]) {
  return objects.reduce((result, obj) => {
    if (obj === undefined) {
      return result || {};
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isPlainObject(obj[key]) && !Array.isArray(obj[key])) {
          result[key] = mergeConfig(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }, {});
}

export function isPersonalAccessToken(token?: string) {
  return token?.startsWith('pat_');
}
