import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';

import Ws from './pages/ws';
import Rtc from './pages/rtc';
import AudioTest from './pages/audio-test';
import Transcription from './pages/transcription';
import Speech from './pages/speech';
function App() {
  return (
    <Router>
      <div className="app">
        {/* <nav>
          <ul>
            <li>
              <Link to="/rtc">Realtime Demo Base on RTC</Link>
            </li>
            <li>
              <Link to="/">Realtime Demo Base on WebSocket</Link>
            </li>
            <li>
              <Link to="/audio-test">Audio Test</Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/" element={<Ws />} />
          <Route path="/rtc" element={<Rtc />} />
          <Route path="/audio-test" element={<AudioTest />} />
          <Route path="/transcription" element={<Transcription />} />
          <Route path="/speech" element={<Speech />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
