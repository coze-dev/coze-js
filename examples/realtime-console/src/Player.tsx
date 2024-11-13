import { Checkbox } from 'antd';
import './App.css';
import { type RealtimeClient } from '@coze/realtime-api';
import { type CheckboxChangeEvent } from 'antd/es/checkbox';

const Player: React.FC<{
  clientRef: React.MutableRefObject<RealtimeClient | null>;
}> = ({ clientRef }) => {
  const handleToggleVideo = (e: CheckboxChangeEvent) => {
    clientRef.current?.setVideoEnable(e.target.checked);

    localStorage.setItem('videoState', e.target.checked.toString());
  };

  return (
    <div className="player-container">
      <label>
        <Checkbox
          defaultChecked={localStorage.getItem('videoState') === 'true'}
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
