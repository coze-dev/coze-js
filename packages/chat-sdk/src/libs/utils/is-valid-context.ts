import { type NonNullableType } from '@/libs/types';
export const isValidContext = <T extends object>(
  context: T,
): context is NonNullableType<T> =>
  Object.keys(context)
    .map(keyName => context[keyName as keyof T])
    .reduce(
      (prevResult, currentProperty) => prevResult && currentProperty !== null,
      true,
    );
