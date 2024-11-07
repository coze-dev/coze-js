import React, { useState, useEffect, useRef, useCallback } from 'react';

import { RealtimeClient } from '@coze/realtime-api';
import { type OAuthToken, type SimpleBot } from '@coze/api';

import useCozeAPI, {
  BASE_URL,
  INVALID_ACCESS_TOKEN,
  type VoiceOption,
} from './use-coze-api';
import phoneIcon from './assets/phone.svg';
import microphoneIcon from './assets/microphone.svg';
import microphoneOffIcon from './assets/microphone-off.svg';
import cozeLogo from './assets/coze.png';
import closeIcon from './assets/close.svg';

const SECONDS_IN_MINUTE = 60;
const PAD_LENGTH = 2;
const TIMER_INTERVAL = 1000;
const CONNECTOR_ID = '1024';

// Extract some logic into separate components to reduce main component size
const LoginView: React.FC<{ handleLogin: () => Promise<void> }> = ({
  handleLogin,
}) => (
  <div className="container">
    <div className="phone-container">
      <div className="title-text">Coze AI Voice Call</div>
      <div className="avatar-container">
        <img src={cozeLogo} alt="Bot Avatar" className="avatar-image" />
      </div>
      <button className="login-button" onClick={handleLogin}>
        Login to Experience
      </button>
    </div>
  </div>
);

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
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const refreshTokenData = localStorage.getItem('refreshToken') || '';
  const realtimeAPIRef = useRef<RealtimeClient | null>(null);

  const {
    api,
    getAuthUrl,
    getToken,
    refreshToken,
    getVoice,
    getOrCreateRealtimeBot,
  } = useCozeAPI({
    accessToken,
  });

  const tryRefreshToken = useCallback(
    async (errorMsg: string) => {
      if (!`${errorMsg}`.includes(INVALID_ACCESS_TOKEN)) {
        return;
      }

      if (!refreshTokenData) {
        localStorage.removeItem('accessToken');
        return;
      }

      try {
        const newToken = await refreshToken(refreshTokenData);
        storeToken(newToken);
      } catch (err) {
        console.log(`refresh token error: ${err}`);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
      }
    },
    [refreshToken, refreshTokenData],
  );

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
          const newToken = await getToken(code, codeVerifier);
          storeToken(newToken);
        }
      } finally {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    })();
  }, [getToken]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / SECONDS_IN_MINUTE);
    const secs = seconds % SECONDS_IN_MINUTE;
    return `${mins.toString().padStart(PAD_LENGTH, '0')}:${secs
      .toString()
      .padStart(PAD_LENGTH, '0')}`;
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach(track => track.stop());
      setErrorMessage('');
      console.log('✅ Microphone permission granted');
      return true;
    } catch (error) {
      console.error('❌ Failed to get microphone permission:', error);
      setErrorMessage('Please allow microphone access to start the call');
      return false;
    }
  };

  const initializeRealtimeCall = async () => {
    if (!bot?.bot_id) {
      setErrorMessage('Bot not initialized');
      return false;
    }

    try {
      console.log('🚀 Initializing realtime call client:', {
        botId: bot.bot_id,
        voiceId: voice?.value,
      });

      realtimeAPIRef.current = new RealtimeClient({
        accessToken,
        baseURL: BASE_URL,
        botId: bot.bot_id,
        voiceId: voice?.value,
        debug: true,
        allowPersonalAccessTokenInBrowser: true,
        connectorId: CONNECTOR_ID,
      });

      console.log('📞 Connecting to server...');
      await realtimeAPIRef.current.connect();
      console.log('✅ Server connected successfully');

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize realtime call:', error);
      tryRefreshToken(`${error}`);
      setErrorMessage('Call initialization failed, please try again');
      return false;
    }
  };

  const handleEndCall = () => {
    console.log('👋 Ending call');
    setIsCallActive(false);
    setIsMuted(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimer(0);

    if (realtimeAPIRef.current) {
      console.log('🔌 Disconnecting from server');
      realtimeAPIRef.current.disconnect();
      realtimeAPIRef.current = null;
    }
  };

  const handleToggleMicrophone = () => {
    if (realtimeAPIRef.current) {
      console.log(`🎤 ${isMuted ? 'Unmute' : 'Mute'} microphone`);
      realtimeAPIRef.current.setAudioEnable(isMuted);
      setIsMuted(!isMuted);
    } else {
      console.error('❌ RealtimeClient not initialized');
      setErrorMessage('Call not properly initialized, please try again');
    }
  };

  const handleCall = async () => {
    if (!isCallActive) {
      console.log('🎤 Requesting microphone permission...');
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        console.log('❌ Microphone permission denied');
        return;
      }

      console.log('🔄 Initializing call...');
      const initialized = await initializeRealtimeCall();
      if (!initialized) {
        console.log('❌ Call initialization failed');
        return;
      }

      console.log('✅ Call started');
      setIsCallActive(true);
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, TIMER_INTERVAL);
      setTimerInterval(interval);
    } else {
      console.log('📞 Call ended');
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
      if (!accessToken) {
        return;
      }

      try {
        console.log('🤖 Getting or creating Bot...');
        const newBot = await getOrCreateRealtimeBot();
        console.log(
          '✅ Bot retrieved successfully:',
          newBot?.bot_name,
          newBot?.bot_id,
        );
        setBot(newBot);
      } catch (err) {
        console.error('❌ Failed to retrieve Bot:', err);
        tryRefreshToken(`${err}`);
      }

      try {
        console.log('🎵 Getting voice configuration...');
        const newVoice = await getVoice();
        console.log(
          '✅ Voice configuration retrieved successfully:',
          newVoice?.name,
        );
        setVoice(newVoice);
      } catch (err) {
        console.error('❌ Failed to retrieve voice configuration:', err);
        tryRefreshToken(`${err}`);
      }
    }
    init();
  }, [accessToken, api]);

  if (!accessToken) {
    return <LoginView handleLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div className="phone-container">
        <div className="title-text">Coze AI Voice Call</div>
        <div className="avatar-container">
          <img src={cozeLogo} alt="Bot Avatar" className="avatar-image" />
        </div>
        <div className="status">
          {isCallActive
            ? 'In call with AI Assistant...'
            : 'Click button to start call'}
        </div>
        {isCallActive && <div className="timer">{formatTime(timer)}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="button-container">
          {isCallActive && (
            <button
              className={`mute-button ${isMuted ? 'muted' : ''}`}
              onClick={handleToggleMicrophone}
            >
              <img
                src={isMuted ? microphoneOffIcon : microphoneIcon}
                className={`microphone-icon ${isMuted ? 'muted' : ''}`}
                alt="microphone"
              />
            </button>
          )}
          <button
            className={`call-button ${isCallActive ? 'active' : ''}`}
            onClick={handleCall}
          >
            {isCallActive ? (
              <img
                src={closeIcon}
                className="end-call-icon-svg"
                alt="end call"
              />
            ) : (
              <img src={phoneIcon} className="call-icon-svg" alt="start call" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallUp;
