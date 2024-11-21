import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import RealtimeConsole from './pages/main';
import Login from './pages/login';

const App: React.FC = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<RealtimeConsole />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default App;
