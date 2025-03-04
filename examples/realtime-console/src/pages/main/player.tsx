import { Checkbox } from 'antd';
import '../../App.css';
import { type RealtimeClient } from '@coze/realtime-api';
import { type CheckboxChangeEvent } from 'antd/es/checkbox';

import { LocalManager, LocalStorageKey } from '../../utils/local-manager';

const Player: React.FC<{
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}> = ({ clientRef }) => {
  const localManager = new LocalManager();
  const handleToggleVideo = (e: CheckboxChangeEvent) => {
    clientRef.current?.setVideoEnable(e.target.checked);

    localManager.set(LocalStorageKey.VIDEO_STATE, e.target.checked.toString());
  };
  const videoState = localManager.get(LocalStorageKey.VIDEO_STATE);

  return (
    <div className="player-container">
      <div
        style={{
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label>
          <Checkbox
            defaultChecked={
              localManager.get(LocalStorageKey.VIDEO_STATE) === 'true'
            }
            disabled={!clientRef.current?.isConnected}
            onChange={handleToggleVideo}
          />{' '}
          Video
        </label>
        <a
          href="https://bytedance.larkoffice.com/docx/BdIxdfjraoarXIx2Pszc7Yx5nre"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '14px', textDecoration: 'underline' }}
        >
          点击抢先体验视频模型
        </a>
      </div>

      <div
        style={{
          width: '100%',
          height: videoState === 'true' ? '300px' : '0',
          position: 'relative',
          background: '#000',
        }}
        id={'local-player'}
      ></div>
    </div>
  );
};

export default Player;
