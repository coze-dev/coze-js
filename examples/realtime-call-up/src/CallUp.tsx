import { OAuthToken, type SimpleBot } from '@coze/api';
import { RealtimeClient } from '@coze/realtime-api';
import React, { useState, useEffect, useRef } from 'react';
import useCozeAPI, { INVALID_ACCESS_TOKEN, VoiceOption } from './use-coze-api';
import cozeLogo from './coze.png';
import './CallUp.css';

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
      tryRefreshToken(`${error}`);
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

  const handleToggleMicrophone = () => {
    if (realtimeAPIRef.current) {
      realtimeAPIRef.current.setAudioEnable(isMuted);
      setIsMuted(!isMuted);
      // message.success(`Microphone ${!isMicrophoneOn ? 'unmuted' : 'muted'}`);
    } else {
      // message.error('Please click Settings to set configuration first');
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
      <div className="container">
        <div className="phone-container">
          <div className="bot-name">欢迎使用语音通话</div>
          <button className="login-button" onClick={handleLogin}>
            立即登录体验
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="phone-container">
        <div className="title-text">Coze AI 助手</div>
        <div className="avatar-container">
          <img src={cozeLogo} alt="Bot Avatar" className="avatar-image" />
        </div>
        <div className="status">
          {isCallActive ? '正在与智能助手通话中...' : '点击按钮开始通话'}
        </div>
        {isCallActive && <div className="timer">{formatTime(timer)}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="button-container">
          {isCallActive && (
            <button
              className={`mute-button ${isMuted ? 'muted' : ''}`}
              onClick={handleToggleMicrophone}
            >
              <svg
                className={`microphone-icon ${isMuted ? 'muted' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                {isMuted && (
                  <path d="M3.27 3L2 4.27l4.19 4.19L6 9c0 3.53 2.61 6.43 6 6.92V19h2v-3.08c.57-.08 1.12-.24 1.64-.45L19.73 21 21 19.73 3.27 3z" />
                )}
              </svg>
            </button>
          )}
          <button
            className={`call-button ${isCallActive ? 'active' : ''}`}
            onClick={handleCall}
          >
            {isCallActive ? (
              <svg className="end-call-icon-svg" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            ) : (
              <svg className="call-icon-svg" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallUp;
