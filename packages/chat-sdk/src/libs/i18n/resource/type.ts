import React from 'react';
export interface I18nSpecial {
  [key: string]: (
    options?: Record<string, unknown>,
  ) => string | React.ReactNode;
}

export interface Resource {
  simple: {
    [key: string]: string;
  };
  special: I18nSpecial;
}
