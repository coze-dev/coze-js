import '@testing-library/jest-dom';
import React from 'react';

import { vi, beforeEach } from 'vitest';

vi.stubGlobal('ENABLE_INNER_HTML', true);
vi.stubGlobal('ENABLE_ADJACENT_HTML', true);
vi.stubGlobal('ENABLE_CLONE_NODE', true);

vi.stubGlobal('ENABLE_CONTAINS', true);
vi.stubGlobal('ENABLE_SIZE_APIS', true);
vi.stubGlobal('ENABLE_TEMPLATE_CONTENT', true);

vi.mock('@tarojs/components', () => ({
  View: props => React.createElement('div', props),
  WebView: props => React.createElement('div', props),
}));

beforeEach(() => {
  global.alert = info => {
    console.log(info);
  };
  global.ENABLE_INNER_HTML = true;
  global.ENABLE_ADJACENT_HTML = true;
  global.ENABLE_CLONE_NODE = true;

  global.ENABLE_CONTAINS = true;
  global.ENABLE_SIZE_APIS = true;
  global.ENABLE_TEMPLATE_CONTENT = true;
});

global.React = React;
