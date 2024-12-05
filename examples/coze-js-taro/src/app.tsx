import { type PropsWithChildren } from 'react';

import { useLaunch } from '@tarojs/taro';

import './app.css';

export default function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.');
  });

  return children;
}
