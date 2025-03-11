import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';

import Ws from './pages/ws';
import Rtc from './pages/rtc';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/rtc">Realtime Demo Base on RTC</Link>
            </li>
            <li>
              <Link to="/ws">Realtime Demo Base on WebSocket</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/rtc" element={<Rtc />} />
          <Route path="/ws" element={<Ws />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
