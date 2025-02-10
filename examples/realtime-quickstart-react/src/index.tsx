import React from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import 'antd/dist/reset.css'; // 如果使用 antd v5

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
