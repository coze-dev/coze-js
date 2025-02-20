import type { Parent } from 'mdast';

export const isParent = (value?: { children: unknown }): value is Parent =>
  !!value?.children;
export const getRegResult = (
  value: string,
  regExps: RegExp[],
): RegExpExecArray | null => {
  let fixMatch: RegExpExecArray | null = null;
  regExps.find(pattern => {
    fixMatch = pattern.exec(value);
    return fixMatch;
  });
  return fixMatch;
};
