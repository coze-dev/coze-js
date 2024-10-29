import React, { useState } from 'react';
import './App.css';
import { useCozeAPI } from './use-coze-api';
import Setting, { SettingConfig } from './Setting';

function App() {
  const { initClient, message, sendMessage, isReady, uploadFile } = useCozeAPI();
  const [isModify, setIsModify] = useState(false);
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (settingConfig: SettingConfig) => {
    initClient(settingConfig);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (file) {
        uploadFile(file);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Setting onSubmit={handleSubmit} onChange={setIsModify} />
      <div className="header">
        <div>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} name="file" />
            <button type="submit" disabled={isModify || !isReady}>
              Upload
            </button>
          </form>
        </div>
        <div>
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
      </div>
      <pre className="content">
        <code>{message}</code>
      </pre>
    </div>
  );
}

export default App;
