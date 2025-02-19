import { type Context, useContext } from 'react';

import { isValidContext } from '@/libs/utils';
import { type NullableType } from '@/libs/types';

export const useValidContext = <T>(
  context: Context<NullableType<T>>,
  errorMsg = 'Invalid chat frame context',
) => {
  const value = useContext(context);
  if (!isValidContext(value)) {
    throw new Error(errorMsg);
  }
  return value;
};
