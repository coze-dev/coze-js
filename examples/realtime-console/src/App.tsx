import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import RealtimeConsole from './pages/main';
import Login from './pages/login';
import config from './config.json';

const App: React.FC = () => {
  for (const key in config) {
    localStorage.setItem(key, config[key as keyof typeof config]);
  }
  localStorage.setItem('token_expires_at', '2739005652000');
  localStorage.setItem('workspace_id', 'personal_xxx');

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<RealtimeConsole />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
