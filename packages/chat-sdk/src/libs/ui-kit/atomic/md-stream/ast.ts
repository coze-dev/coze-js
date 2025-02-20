import type { Code, Text, RootContent } from 'mdast';

export interface IndicatorLocal {
  type: 'indicator';
}
export interface CodeLocal extends Code {
  children?: Array<IndicatorLocal | Text>;
}
export type RootContentLocal = RootContent | IndicatorLocal | CodeLocal;

export interface TaskValue {
  id: string;
  index: number;
  values: string[];
}
