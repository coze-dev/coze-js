import React, { useState, useEffect } from 'react';

import {
  message,
  Form,
  Select,
  Badge,
  Space,
  Modal,
  Button,
  Upload,
  Input,
} from 'antd';
import { type CloneVoiceReq } from '@coze/api';
import {
  PlayCircleOutlined,
  CopyOutlined,
  UploadOutlined,
  AudioOutlined,
} from '@ant-design/icons';

import { type VoiceOption } from '../../hooks/use-coze-api';

const VoiceClone: React.FC<{
  visible: boolean;
  onClose: () => void;
  voice?: VoiceOption;
  cloneVoice: (params: CloneVoiceReq) => Promise<string>;
}> = ({ visible, onClose, voice, cloneVoice }) => {
  const [form] = Form.useForm();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaRecorderState, setMediaRecorderState] = useState<MediaStream>();
  const [recorderState, setRecorderState] = useState<MediaRecorder>();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const file = values.audio?.file;
      if (!file) {
        message.error('Please upload an audio file');
        return;
      }

      const audioFormat = file.name.split('.').pop()?.toLowerCase();
      const supportedFormats = ['wav', 'mp3', 'ogg', 'm4a', 'aac', 'pcm'];
      if (!supportedFormats.includes(audioFormat)) {
        message.error('Unsupported audio format');
        return;
      }

      const params: CloneVoiceReq = {
        voice_name: values.name,
        preview_text: values.preview_text,
        language: values.language,
        audio_format: audioFormat,
        file,
      };

      // Pass voice_id for non-first-time cloning
      if (
        voice?.is_system_voice === false &&
        voice?.available_training_times > 0
      ) {
        params.voice_id = voice.value;
      }

      await cloneVoice(params);
      message.success('Clone voice success');
      onClose();
    } catch (err) {
      console.error(err);
      message.error(`Clone voice failed: ${err}`);
      // code: 4100, remove token
      if (`${err}`.includes('code: 4100')) {
        console.log(`remove token in voice clone failed: ${err}`);
        localStorage.removeItem('accessToken');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Clone Voice"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <div
        style={{
          backgroundColor: '#fff0f6',
          border: '1px solid #ffadd2',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}
      >
        <strong>注意：</strong> 音色复刻需要收费。请参阅
        <a
          href="https://www.coze.cn/open/docs/developer_guides/clone_voices?from=search"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '4px' }}
        >
          音色复刻说明文档
        </a>
        了解价格详情。
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: voice?.name || '',
          preview_text:
            voice?.preview_text ||
            '你好，我是你的专属AI克隆声音，希望未来可以一起好好相处哦',
          language: voice?.language_code || 'zh',
        }}
      >
        <Form.Item
          name="name"
          label="Voice Name"
          rules={[{ required: true, message: 'Please enter voice name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="preview_text"
          label="Preview Text"
          rules={[{ required: true, message: 'Please enter preview text' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true, message: 'Please select a language' }]}
        >
          <Select>
            <Select.Option value="zh">Chinese</Select.Option>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="ja">Japanese</Select.Option>
            <Select.Option value="es">Spanish</Select.Option>
            <Select.Option value="id">Indonesian</Select.Option>
            <Select.Option value="pt">Portuguese</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="audio"
          label="Audio"
          rules={[{ required: true, message: 'Please upload or record audio' }]}
        >
          <Space
            split={
              <div
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: '#d9d9d9',
                  margin: '0 8px',
                }}
              />
            }
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept=".wav,.mp3,.ogg,.m4a,.aac,.pcm"
              onChange={info => {
                if (info.file) {
                  form.setFieldsValue({
                    audio: {
                      file: info.file,
                      fileList: [info.file],
                    },
                  });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Audio</Button>
            </Upload>
            <Button
              icon={<AudioOutlined />}
              type={isRecording ? 'primary' : 'default'}
              danger={isRecording}
              onClick={async () => {
                if (isRecording) {
                  recorderState?.stop();
                  mediaRecorderState
                    ?.getTracks()
                    .forEach(track => track.stop());
                } else {
                  const chunks: Blob[] = [];

                  const mediaRecorder =
                    await navigator.mediaDevices.getUserMedia({
                      audio: true,
                      video: false,
                    });
                  const recorder = new MediaRecorder(mediaRecorder);
                  setMediaRecorderState(mediaRecorder);
                  setRecorderState(recorder);

                  recorder.ondataavailable = e => {
                    chunks.push(e.data);
                  };

                  recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    const file = new File([blob], 'recording.wav', {
                      type: 'audio/wav',
                    });
                    form.setFieldsValue({
                      audio: {
                        file,
                        fileList: [
                          {
                            uid: '-1',
                            name: 'recording.wav',
                            status: 'done',
                            url: URL.createObjectURL(blob),
                          },
                        ],
                      },
                    });
                    setIsRecording(false);
                    message.success('Recording completed');
                  };

                  recorder.start();
                  setIsRecording(true);
                  message.info('Start recording');
                }
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const VoiceSelect: React.FC<{
  voices: VoiceOption[];
  loading: boolean;
  value?: string;
  onChange?: (value: string) => void;
  fetchAllVoices?: () => Promise<VoiceOption[]>;
  cloneVoice: (params: CloneVoiceReq) => Promise<string>;
}> = ({ voices, loading, value, onChange, fetchAllVoices, cloneVoice }) => {
  const [audioPlayer] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [cloneModalVisible, setCloneModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>();

  const handleAudioError = (error: Event | string) => {
    message.error('Failed to play audio preview');
    console.error('Audio playback error:', error);
  };

  const handlePreview = (previewUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioPlayer.src === previewUrl) {
      if (audioPlayer.paused) {
        audioPlayer.play();
        setIsPlaying(true);
      } else {
        audioPlayer.pause();
        setIsPlaying(false);
      }
    } else {
      audioPlayer.src = previewUrl;
      audioPlayer.onerror = handleAudioError;
      audioPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleClone = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!voice) {
      return;
    }
    setSelectedVoice(voice);
    setCloneModalVisible(true);
  };

  useEffect(
    () => () => {
      audioPlayer.pause();
      audioPlayer.onerror = null;
      audioPlayer.src = '';
      setIsPlaying(false);
    },
    [audioPlayer],
  );

  return (
    <>
      <Button
        type="primary"
        icon={<CopyOutlined />}
        onClick={e => handleClone(voices[0], e)}
        style={{ marginBottom: 16 }}
      >
        Clone Voice
      </Button>
      <Select
        value={value}
        onChange={onChange}
        placeholder="Select a voice"
        allowClear
        style={{ width: '100%' }}
        loading={loading}
      >
        {voices.map(voice => (
          <Select.Option key={voice.value} value={voice.value}>
            <Space>
              {voice.name} ({voice.language_name})
              <Badge
                count={voice.is_system_voice ? 'System' : 'Custom'}
                style={{
                  backgroundColor: voice.is_system_voice
                    ? '#87d068'
                    : '#108ee9',
                }}
              />
              {voice?.preview_url && (
                <PlayCircleOutlined
                  onClick={e => handlePreview(voice.preview_url || '', e)}
                  aria-label={`Play ${voice.name} preview`}
                  role="button"
                  aria-pressed={
                    isPlaying && audioPlayer.src === voice.preview_url
                  }
                />
              )}
              {/* Only show clone button for custom voices with available training times */}
              {!voice.is_system_voice && voice.available_training_times > 0 && (
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={e => handleClone(voice, e)}
                  size="small"
                >
                  Clone
                </Button>
              )}
            </Space>
          </Select.Option>
        ))}
      </Select>
      <VoiceClone
        visible={cloneModalVisible}
        onClose={async () => {
          await fetchAllVoices?.();
          setCloneModalVisible(false);
        }}
        voice={selectedVoice}
        cloneVoice={cloneVoice}
      />
    </>
  );
};

export default VoiceSelect;
