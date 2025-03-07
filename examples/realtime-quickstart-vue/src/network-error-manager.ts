import { NetworkQuality, StreamIndex } from '@volcengine/rtc';
import { EventNames, type RealtimeClient } from '@coze/realtime-api';

type ConnectStatus =
  | 'connected' // Connection successful
  | 'disconnected' // Connection disconnected
  | 'connecting' // Connecting
  | 'reconnecting'; // Network error, attempting to reconnect

export class NetworkErrorManager {
  private client: RealtimeClient | null = null;
  private downStartTime: number | null = null;
  private isDisconnected = false;
  private connectStatus: ConnectStatus = 'disconnected';
  private micCheckTimer: number | null = null;

  constructor(client: RealtimeClient) {
    this.client = client;
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    // Network status listeners
    window.addEventListener('online', this.checkNetworkStatus);
    window.addEventListener('offline', this.checkNetworkStatus);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Client event listeners
    this.client?.on(EventNames.ALL, this.handleConnectStatus);

    // Start mic check
    this.micCheckTimer = window.setInterval(this.handleMicAccess, 5000);
  }

  public destroy() {
    window.removeEventListener('online', this.checkNetworkStatus);
    window.removeEventListener('offline', this.checkNetworkStatus);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
    this.client?.off(EventNames.ALL, this.handleConnectStatus);
    if (this.micCheckTimer) {
      clearInterval(this.micCheckTimer);
    }
  }

  private checkNetworkStatus = () => {
    if (!navigator.onLine) {
      console.log('network offline');
      this.setConnectStatus('reconnecting');
    }
  };

  private handleVisibilityChange = () => {
    console.log('visibilitychange', document.hidden);
    if (!document.hidden) {
      if (navigator.onLine && this.isDisconnected) {
        this.isDisconnected = false;
        setTimeout(async () => {
          try {
            await this.client?.connect();
            console.log('reconnect success');
          } catch (e) {
            console.error('reconnect failed', e);
          }
        }, 1000);
      }
    }
  };

  private handleDisconnect = async (prefix: string) => {
    try {
      await this.client?.disconnect();
      this.downStartTime = null;
      this.isDisconnected = true;
      console.log(`${prefix} disconnect success`);
    } catch (e) {
      console.error(`${prefix} disconnect failed`, e);
    }
  };

  private handleNetworkQuality = (uplinkNetworkQuality: NetworkQuality) => {
    if (uplinkNetworkQuality === NetworkQuality.DOWN) {
      if (!this.downStartTime) {
        this.downStartTime = Date.now();
      }
      const duration = Date.now() - this.downStartTime;
      console.log('Network down duration', duration / 1000);

      if (duration > 20 * 1000) {
        this.handleDisconnect('network down');
      }
    } else {
      this.downStartTime = null;
    }
  };

  private handleIceState = (uplinkNetworkQuality: NetworkQuality) => {
    try {
      const iceState = this.client?.getRtcEngine()?.iceState;

      if (uplinkNetworkQuality === NetworkQuality.DOWN) {
        this.setConnectStatus('reconnecting');
      } else {
        if (iceState === 'connected') {
          this.setConnectStatus('connected');
        } else {
          this.setConnectStatus('reconnecting');
        }
      }
    } catch (e) {
      console.error('get iceState failed', e);
      this.setConnectStatus('reconnecting');
    }
  };

  private handleConnectStatus = (eventName: string, data: unknown) => {
    switch (eventName) {
      case EventNames.CONNECTED:
        this.setConnectStatus('connected');
        break;
      case EventNames.DISCONNECTED:
        this.setConnectStatus('disconnected');
        break;
      case EventNames.CONNECTING:
        this.setConnectStatus('connecting');
        break;
      case EventNames.NETWORK_QUALITY: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uplinkNetworkQuality = (data as any)
          .uplinkNetworkQuality as NetworkQuality;
        this.handleNetworkQuality(uplinkNetworkQuality);
        this.handleIceState(uplinkNetworkQuality);
        break;
      }
      case EventNames.BOT_LEAVE:
        this.handleDisconnect('bot leave');
        break;
      default:
        break;
    }
  };

  private handleMicAccess = () => {
    if (this.client?.isConnected === false || document.hidden) {
      return;
    }
    try {
      const localStream = this.client
        ?.getRtcEngine()
        ?.getLocalStreamTrack(StreamIndex.STREAM_INDEX_MAIN, 'audio');
      if (!localStream) {
        this.handleDisconnect('local stream null');
      }
    } catch (error) {
      console.error('Microphone access failed:', error);
      this.handleDisconnect('microphone access failed');
    }
  };

  private setConnectStatus(status: ConnectStatus) {
    this.connectStatus = status;
    this.onStatusChange?.(status);
  }

  public getConnectStatus(): ConnectStatus {
    return this.connectStatus;
  }
  public onStatusChange?: (status: ConnectStatus) => void;
}
