import { WsChatClient } from '@coze/api/ws-tools';
import { Button, message, Space, Modal, Input, Checkbox } from 'antd';
import {
  MutableRefObject,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';

// 定义暴露给父组件的方法接口
export interface CustomTrackHandle {
  play: () => void;
  pause: () => void;
  getAudioElement: () => HTMLAudioElement | null;
}

const CustomTrack = forwardRef<CustomTrackHandle>((props, ref) => {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState('/babble_15dB.opus');
  const [tempUrl, setTempUrl] = useState('');
  const [isCustomAudio, setIsCustomAudio] = useState(false);

  // 通过 useImperativeHandle 暴露方法
  useImperativeHandle(ref, () => ({
    play: () => audioElement.current?.play(),
    pause: () => audioElement.current?.pause(),
    getAudioElement: () => audioElement.current,
  }));

  const handleOk = () => {
    if (tempUrl) {
      setAudioUrl(tempUrl);
      setIsModalOpen(false);
      // 重置临时 URL
      setTempUrl('');
    }
  };

  return (
    <Space>
      自定义音频
      <Checkbox
        checked={isCustomAudio}
        onChange={e => setIsCustomAudio(e.target.checked)}
      ></Checkbox>
      <audio
        crossOrigin="anonymous"
        ref={audioElement}
        src={audioUrl}
        loop={false}
        controls
      />
      <Button onClick={() => setIsModalOpen(true)}>设置音频</Button>
      <Modal
        title="设置音频 URL"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="请输入音频 URL"
          value={tempUrl}
          onChange={e => setTempUrl(e.target.value)}
        />
      </Modal>
    </Space>
  );
});

export default CustomTrack;
