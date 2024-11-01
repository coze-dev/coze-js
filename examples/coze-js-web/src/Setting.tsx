import { useEffect, useState } from 'react';
import './App.css';

export type SettingConfig = {
  authType: string;
  baseUrl: string;
  token?: string;
  botId: string;
  clientId?: string;
  clientSecret?: string;
};

interface Props {
  onSubmit: (settingConfig: SettingConfig) => void;
  onChange: (isModify: boolean) => void;
}

function Setting({ onSubmit, onChange }: Props) {
  const [botId, setBotId] = useState('');
  const [token, setToken] = useState('');
  const [authType, setAuthType] = useState('pat_token');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.coze.com');
  const [isModify, setIsModify] = useState(false);

  useEffect(() => {
    const settingConfig = localStorage.getItem('settingConfig');
    if (settingConfig) {
      const config = JSON.parse(settingConfig);
      setAuthType(config.authType);
      setBotId(config.botId);
      setToken(config.token);
      setClientId(config.clientId);
      setClientSecret(config.clientSecret);
      setBaseUrl(config.baseUrl);
    }
  }, []);

  useEffect(() => {
    onChange(isModify);
  }, [isModify]);

  const handleSubmit = () => {
    const settingConfig = {
      authType,
      token: authType === 'pat_token' ? token : '',
      botId,
      clientId,
      clientSecret,
      baseUrl,
    };
    onSubmit(settingConfig);
    setIsModify(false);
    onChange(false);

    localStorage.setItem('settingConfig', JSON.stringify(settingConfig));
  };

  return (
    <div className="auth">
      <div className="item">
        <label>Auth Type:</label>
        <select
          value={authType}
          onChange={e => {
            setAuthType(e.target.value);
            setToken('');
            setClientId('');
            setIsModify(true);
          }}
        >
          <option value="pat_token">pat_token</option>
          <option value="oauth_token">oauth_token</option>
          <option value="oauth_pkce">oauth_pkce</option>
        </select>
      </div>
      <div className="item">
        <label>Base URL:</label>
        <input
          value={baseUrl}
          onChange={e => {
            setBaseUrl(e.target.value);
            setIsModify(true);
          }}
        ></input>
      </div>
      <div className="item">
        <label>Bot Id:</label>
        <input
          value={botId}
          onChange={e => {
            setBotId(e.target.value);
            setIsModify(true);
          }}
        ></input>
      </div>
      {authType === 'pat_token' && (
        <div className="item">
          <label>Pat Token:</label>
          <input
            value={token}
            onChange={e => {
              setToken(e.target.value);
              setIsModify(true);
            }}
          ></input>
        </div>
      )}
      {authType !== 'pat_token' && (
        <div className="item">
          <label>Client Id:</label>
          <input
            value={clientId}
            onChange={e => {
              setClientId(e.target.value);
              setIsModify(true);
            }}
          ></input>
        </div>
      )}
      {authType === 'oauth_token' && (
        <div className="item">
          <label>Client Secret:</label>
          <input
            value={clientSecret}
            onChange={e => {
              setClientSecret(e.target.value);
              setIsModify(true);
            }}
          ></input>
        </div>
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Setting;
