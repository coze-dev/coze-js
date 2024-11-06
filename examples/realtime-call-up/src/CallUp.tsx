import { OAuthToken, type SimpleBot } from '@coze/api';
import { RealtimeClient } from '@coze/realtime-api';
import React, { useState, useEffect, useRef } from 'react';
import useCozeAPI, { INVALID_ACCESS_TOKEN, VoiceOption } from './use-coze-api';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f2f9 100%)',
  padding: '10px',
  boxSizing: 'border-box' as const,
};

const phoneContainerStyle = {
  width: '100%',
  maxWidth: '600px',
  padding: '20px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  backdropFilter: 'blur(4px)',
  textAlign: 'center' as const,
  '@media (max-width: 768px)': {
    width: '50vw',
    maxWidth: 'none',
    padding: '10px',
  },
};

const avatarStyle = {
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  marginBottom: '30px',
  border: '3px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '@media (max-width: 768px)': {
    width: '100%',
    height: 'auto',
    aspectRatio: '1',
    marginBottom: '20px',
  },
};

const botNameStyle = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: '#2c3e50',
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
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@media (max-width: 480px)': {
    width: '50px',
    height: '50px',
    fontSize: '20px',
  },
});

const getMuteButtonStyle = (muted: boolean) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: muted ? '#ff9800' : '#2196F3',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  margin: '20px 10px',
  transition: 'all 0.3s',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@media (max-width: 480px)': {
    width: '50px',
    height: '50px',
    fontSize: '20px',
  },
});

const loginButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '20px 0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const timerStyle = {
  fontSize: '24px',
  color: '#2c3e50',
  margin: '10px 0',
  '@media (max-width: 480px)': {
    fontSize: '20px',
  },
};

const statusStyle = {
  fontSize: '18px',
  color: '#34495e',
  marginBottom: '20px',
  '@media (max-width: 480px)': {
    fontSize: '16px',
  },
};

const errorMessageStyle = {
  color: '#ff4444',
  fontSize: '14px',
  marginTop: '10px',
  padding: '8px',
  backgroundColor: 'rgba(255, 68, 68, 0.1)',
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const CallUp: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [bot, setBot] = useState<SimpleBot | null>(null);
  const [voice, setVoice] = useState<VoiceOption | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [refreshTokenData, setRefreshTokenData] = useState<string>(
    localStorage.getItem('refreshToken') || '',
  );
  const realtimeAPIRef = useRef<RealtimeClient | null>(null);

  const {
    api,
    getAuthUrl,
    getToken,
    refreshToken,
    getSomeVoice,
    getOrCreateRealtimeCallUpBot,
  } = useCozeAPI({
    accessToken,
    baseURL: 'https://api.coze.cn',
  });

  const tryRefreshToken = async (err: string) => {
    // no error 401
    if (!`${err}`.includes(INVALID_ACCESS_TOKEN)) return;

    if (!refreshTokenData) {
      // remove access token, can't refresh
      localStorage.removeItem('accessToken');
      return;
    }

    try {
      const token = await refreshToken(refreshTokenData);
      storeToken(token);
    } catch (err) {
      console.log(`refresh token error: ${err}`);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
    }
  };

  const storeToken = (token: OAuthToken) => {
    setAccessToken(token.access_token);
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
  };

  const handleLogin = async () => {
    const { url, codeVerifier } = await getAuthUrl();
    localStorage.setItem('codeVerifier', codeVerifier);
    window.location.href = url;
  };

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const codeVerifier = localStorage.getItem('codeVerifier');

      try {
        if (code && codeVerifier) {
          const token = await getToken(code, codeVerifier);
          storeToken(token);
        }
      } finally {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    })();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach(track => track.stop());
      setHasAudioPermission(true);
      setErrorMessage('');
      return true;
    } catch (error) {
      console.error('麦克风权限获取失败:', error);
      setErrorMessage('请允许访问麦克风以开始通话');
      setHasAudioPermission(false);
      return false;
    }
  };

  const initializeRealtimeCall = async () => {
    if (!bot?.bot_id) {
      setErrorMessage('Bot未初始化');
      return false;
    }

    try {
      realtimeAPIRef.current = new RealtimeClient({
        accessToken,
        baseURL: 'https://api.coze.cn',
        botId: bot.bot_id,
        voiceId: voice?.value,
        debug: true,
        allowPersonalAccessTokenInBrowser: true,
        connectorId: '1024',
      });

      await realtimeAPIRef.current.connect();

      return true;
    } catch (error) {
      console.error('实时通话初始化失败:', error);
      setErrorMessage('通话初始化失败，请重试');
      return false;
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimer(0);

    if (realtimeAPIRef.current) {
      realtimeAPIRef.current.disconnect();
      realtimeAPIRef.current = null;
    }
  };

  const handleMute = () => {
    if (realtimeAPIRef.current) {
      setIsMuted(!isMuted);
      realtimeAPIRef.current.setMuted(!isMuted);
    }
  };

  const handleCall = async () => {
    if (!isCallActive) {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      const initialized = await initializeRealtimeCall();
      if (!initialized) {
        return;
      }

      setIsCallActive(true);
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      handleEndCall();
    }
  };

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

  useEffect(() => {
    async function init() {
      if (!accessToken) return;

      try {
        const bot = await getOrCreateRealtimeCallUpBot();
        console.log(`get bot: ${bot?.bot_name} ${bot?.bot_id}`);
        setBot(bot);
      } catch (err) {
        console.log(`get bot error: ${err}`);
        tryRefreshToken(`${err}`);
      }

      try {
        const voice = await getSomeVoice();
        setVoice(voice);
      } catch (err) {
        console.log(`get voice error: ${err}`);
        tryRefreshToken(`${err}`);
      }
    }
    init();
  }, [accessToken, api]);

  if (!accessToken) {
    return (
      <div style={containerStyle}>
        <div style={phoneContainerStyle}>
          <div style={botNameStyle}>欢迎使用语音通话</div>
          <button style={loginButtonStyle} onClick={handleLogin}>
            立即登录体验
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={phoneContainerStyle}>
        <img
          src={bot?.icon_url || '/default-avatar.png'}
          alt="Bot Avatar"
          style={avatarStyle}
        />
        <div style={statusStyle}>
          {isCallActive ? '正在与智能助手通话中...' : '点击按钮开始通话'}
        </div>
        {isCallActive && <div style={timerStyle}>{formatTime(timer)}</div>}
        {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isCallActive && (
            <button
              style={getMuteButtonStyle(isMuted)}
              onClick={handleMute}
              onMouseOver={e => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
              }}
              onMouseOut={e => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: '24px' }}>{isMuted ? '🔇' : '🎤'}</span>
            </button>
          )}
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
            {isCallActive ? (
              <span style={{ fontSize: '24px' }}>✕</span>
            ) : (
              <span
                style={{
                  fontSize: '32px',
                  transform: 'rotate(15deg)',
                  display: 'inline-block',
                }}
              >
                📞
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallUp;
