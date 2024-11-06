import { type SimpleBot } from '@coze/api';
import React, { useState, useEffect } from 'react';
import useCozeAPI from './use-coze-api';
import { access } from 'fs';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: '#f5f5f5',
  padding: '10px',
  boxSizing: 'border-box' as const,
};

const phoneContainerStyle = {
  width: '100%',
  maxWidth: '300px',
  padding: '20px',
  borderRadius: '20px',
  background: 'white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center' as const,
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  marginBottom: '15px',
  border: '2px solid #eee',
};

const botNameStyle = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: '#333',
  marginBottom: '10px',
};

const getCallButtonStyle = (active: boolean) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: active ? '#ff4444' : '#4CAF50',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  margin: '20px 0',
  transition: 'all 0.3s',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@media (max-width: 480px)': {
    width: '50px',
    height: '50px',
    fontSize: '20px',
  },
});

const timerStyle = {
  fontSize: '24px',
  color: '#333',
  margin: '10px 0',
  '@media (max-width: 480px)': {
    fontSize: '20px',
  },
};

const statusStyle = {
  fontSize: '18px',
  color: '#666',
  marginBottom: '20px',
  '@media (max-width: 480px)': {
    fontSize: '16px',
  },
};

const CallUp: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [bot, setBot] = useState<SimpleBot | null>(null);
  const { getOrCreateRealtimeCallUpBot } = useCozeAPI({
    accessToken:
      'pat_orIAResSJDUxT38T6gH7BwXsVNiEzf4PljAaeRW2JXKaCqWNc8F4PMPP1mYr10Me',
    baseURL: 'https://api.coze.cn',
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true);
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      setIsCallActive(false);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      setTimer(0);
    }
  };

  useEffect(() => {
    async function init() {
      const bot = await getOrCreateRealtimeCallUpBot();
      console.log(`get bot: ${bot?.bot_name} ${bot?.bot_id}`);
      setBot(bot);
    }
    init();
  }, []);

  useEffect(() => {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);

    return () => {
      document.head.removeChild(viewport);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={phoneContainerStyle}>
        <img src={bot?.icon_url} alt="Bot Avatar" style={avatarStyle} />
        <div style={botNameStyle}>{bot?.bot_name}</div>
        <div style={statusStyle}>{isCallActive ? '通话中...' : '准备通话'}</div>
        {isCallActive && <div style={timerStyle}>{formatTime(timer)}</div>}
        <button
          style={getCallButtonStyle(isCallActive)}
          onClick={handleCall}
          onMouseOver={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
          }}
          onMouseOut={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {isCallActive ? '✕' : '✆'}
        </button>
      </div>
    </div>
  );
};

export default CallUp;
