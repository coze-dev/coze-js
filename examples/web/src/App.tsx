import React, { useState } from 'react';
import './App.css';
import { useCozeAPI } from './use-coze-api';

function App() {
  const { message, sendMessage } = useCozeAPI('7393033746926796850');

  const [query, setQuery] = useState('');

  return (
    <div className="App">
      <div className="header">
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            sendMessage(query);
            setQuery('');
          }}
        >
          submit
        </button>
      </div>
      <pre className="content">
        <code>{message}</code>
      </pre>
    </div>
  );
}

export default App;
