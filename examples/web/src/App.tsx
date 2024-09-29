import React, { useState } from 'react';
import './App.css';
import { useCozeAPI } from './use-coze-api';
import Setting, { SettingConfig } from './Setting';

function App() {
  const { initClient, message, sendMessage, isReady } = useCozeAPI();
  const [isModify, setIsModify] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (settingConfig: SettingConfig) => {
    initClient(settingConfig);
  };

  return (
    <div className="App">
      <Setting onSubmit={handleSubmit} onChange={setIsModify} />
      <div className="header">
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
          placeholder={`It's ${isReady && !isModify ? 'ready' : 'not ready'}`}
        ></input>

        <button
          disabled={isModify || !isReady}
          onClick={() => {
            sendMessage(query);
            setQuery('');
          }}
        >
          send message
        </button>
      </div>

      <pre className="content">
        <code>{message}</code>
      </pre>
    </div>
  );
}

export default App;
