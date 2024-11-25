import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Chat from './pages/chat';
import './App.css';
import Voice from './pages/voice';

function App() {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <div className="App">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/voice" element={<Voice />} />
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to Coze Demo</h1>
                <p>Please select a demo:</p>
                <div>
                  <Link to="/chat">Chat Demo</Link>
                </div>
                <div>
                  <Link to="/voice">Voice Demo</Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
