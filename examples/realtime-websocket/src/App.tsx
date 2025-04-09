import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Ws from './pages/ws';
import Transcription from './pages/transcription';
import Speech from './pages/speech';
import AudioTest from './pages/audio-test';
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
          <Route path="/audio-test" element={<AudioTest />} />
          <Route path="/transcription" element={<Transcription />} />
          <Route path="/speech" element={<Speech />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
