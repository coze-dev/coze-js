export type NullableType<T> = {
  [P in keyof T]: T[P] | null;
};
export type NonNullableType<T> = {
  [P in keyof T]: Exclude<T[P], null>;
};
