import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import Subscribe from './pages/subscribe';
import RealtimeConsole from './pages/main';
import Login from './pages/login';

const App: React.FC = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<RealtimeConsole />} />
      <Route path="/login" element={<Login />} />
      <Route path="/subscribe" element={<Subscribe />} />
    </Routes>
  </BrowserRouter>
);

export default App;
