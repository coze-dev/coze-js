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

  return (
    <div className="player-container">
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
      <div
        style={{
          width: '100%',
          height: '300px',
          position: 'relative',
          background: '#000',
        }}
        id={'local-player'}
      ></div>
    </div>
  );
};

export default Player;
