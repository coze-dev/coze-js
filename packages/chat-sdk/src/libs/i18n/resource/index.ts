import { Language } from '@/libs/types';

import { type Resource } from './type';
import SpecialCn from './special/zh';
import SpecialEn from './special/en';
import SimpleCn from './simple/zh';
import SimpleEn from './simple/en';

export const resource: Record<Language, Resource> = {
  [Language.EN]: {
    simple: SimpleEn,
    special: SpecialEn,
  },
  [Language.ZH_CN]: {
    simple: SimpleCn,
    special: SpecialCn,
  },
};
