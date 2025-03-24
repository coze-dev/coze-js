import { Radio, Space, Tooltip, Checkbox, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  AIDenoiserProcessorLevel,
  AIDenoiserProcessorMode,
  PcmRecorder,
  WsChatClient,
} from '@coze/api/ws-tools';

// 定义 ref 暴露的方法和状态接口
export interface AudioConfigRef {
  getSettings: () => {
    denoiseMode: 'NSNG' | 'STATIONARY_NS';
    denoiseLevel: 'SOFT' | 'AGGRESSIVE';
    noiseSuppression: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;
    debug: boolean;
  };
}

export const AudioConfig = forwardRef<
  AudioConfigRef,
  {
    clientRef:
      | MutableRefObject<PcmRecorder | undefined>
      | MutableRefObject<WsChatClient | undefined>;
  }
>(({ clientRef }, ref) => {
  const [denoiseMode, setDenoiseMode] = useState<'NSNG' | 'STATIONARY_NS'>(
    'NSNG',
  );
  const [denoiseLevel, setDenoiseLevel] = useState<'SOFT' | 'AGGRESSIVE'>(
    'SOFT',
  );
  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [autoGainControl, setAutoGainControl] = useState(true);
  const [debug, setDebug] = useState(true);

  useEffect(() => {
    if (!clientRef.current) {
      return;
    }

    const { mode, level } = clientRef.current.config.aiDenoisingConfig || {};
    if (mode) {
      setDenoiseMode(mode);
    }
    if (level) {
      setDenoiseLevel(level);
    }

    const { noiseSuppression, echoCancellation, autoGainControl } =
      clientRef.current.config.audioCaptureConfig || {};
    if (noiseSuppression !== undefined) {
      setNoiseSuppression(noiseSuppression);
    }
    if (echoCancellation !== undefined) {
      setEchoCancellation(echoCancellation);
    }
    if (autoGainControl !== undefined) {
      setAutoGainControl(autoGainControl);
    }
  }, [clientRef.current]);

  // 暴露状态给父组件
  useImperativeHandle(ref, () => ({
    getSettings: () => ({
      denoiseMode,
      denoiseLevel,
      noiseSuppression,
      echoCancellation,
      autoGainControl,
      debug,
    }),
  }));

  const isRecording =
    clientRef.current instanceof PcmRecorder
      ? clientRef.current.getStatus() === 'recording'
      : clientRef.current?.recorder.getStatus() === 'recording';

  const handleDenoiseModeChange = (value: AIDenoiserProcessorMode) => {
    setDenoiseMode(value);
    if (clientRef.current && isRecording) {
      clientRef.current?.setDenoiserMode(value);
    }
  };

  const handleDenoiseLevelChange = (value: AIDenoiserProcessorLevel) => {
    setDenoiseLevel(value);
    if (clientRef.current && isRecording) {
      clientRef.current?.setDenoiserLevel(value);
    }
  };

  return (
    <>
      <Row gutter={[0, 16]}>
        {/* 开发模式 */}
        <Col span={24}>
          <Checkbox
            checked={debug}
            disabled={isRecording}
            onChange={e => setDebug(e.target.checked)}
          >
            开发模式
            <Tooltip title="启用开发模式，控制台会输出更多日志">
              <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
            </Tooltip>
          </Checkbox>
        </Col>

        {/* 音频配置 */}
        <Col span={24}>
          <Row align="middle">
            <Col flex="90px">音频配置：</Col>
            <Col>
              <Checkbox
                checked={noiseSuppression}
                disabled={isRecording}
                onChange={e => setNoiseSuppression(e.target.checked)}
              >
                噪声抑制
                <Tooltip title="启用噪声抑制功能">
                  <InfoCircleOutlined
                    style={{ marginLeft: 4, color: '#999' }}
                  />
                </Tooltip>
              </Checkbox>
              <Checkbox
                checked={echoCancellation}
                disabled={isRecording}
                onChange={e => setEchoCancellation(e.target.checked)}
              >
                回声消除
                <Tooltip title="启用回声消除功能">
                  <InfoCircleOutlined
                    style={{ marginLeft: 4, color: '#999' }}
                  />
                </Tooltip>
              </Checkbox>
              <Checkbox
                checked={autoGainControl}
                disabled={isRecording}
                onChange={e => setAutoGainControl(e.target.checked)}
              >
                自动增益控制
                <Tooltip title="启用自动增益控制功能">
                  <InfoCircleOutlined
                    style={{ marginLeft: 4, color: '#999' }}
                  />
                </Tooltip>
              </Checkbox>
            </Col>
          </Row>
        </Col>

        {/* AI 降噪设置 */}
        {!noiseSuppression && (
          <>
            {/* AI 降噪模式 */}
            <Col span={24}>
              <Row align="middle">
                <Col flex="90px">AI 降噪模式：</Col>
                <Col>
                  <Radio.Group
                    value={denoiseMode}
                    onChange={e => handleDenoiseModeChange(e.target.value)}
                  >
                    <Radio value={AIDenoiserProcessorMode.NSNG}>
                      AI 降噪（推荐）
                      <Tooltip title="AI 降噪。该模式可以压制噪声类型中的稳态与非稳态噪声。">
                        <InfoCircleOutlined
                          style={{ marginLeft: 4, color: '#999' }}
                        />
                      </Tooltip>
                    </Radio>
                    <Radio value={AIDenoiserProcessorMode.STATIONARY_NS}>
                      稳态降噪
                      <Tooltip title="稳态降噪。该模式仅压制稳态噪声，建议仅在 AI 降噪处理耗时过长时使用。">
                        <InfoCircleOutlined
                          style={{ marginLeft: 4, color: '#999' }}
                        />
                      </Tooltip>
                    </Radio>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>

            {/* AI 降噪强度 */}
            <Col span={24}>
              <Row align="middle">
                <Col flex="90px">AI 降噪强度：</Col>
                <Col>
                  <Radio.Group
                    value={denoiseLevel}
                    onChange={e => handleDenoiseLevelChange(e.target.value)}
                  >
                    <Radio value={AIDenoiserProcessorLevel.SOFT}>
                      舒缓降噪（推荐）
                      <Tooltip title="舒缓降噪。（推荐）">
                        <InfoCircleOutlined
                          style={{ marginLeft: 4, color: '#999' }}
                        />
                      </Tooltip>
                    </Radio>
                    <Radio value={AIDenoiserProcessorLevel.AGGRESSIVE}>
                      激进降噪
                      <Tooltip title="激进降噪。将降噪强度提高到激进降噪会增大损伤人声的概率。">
                        <InfoCircleOutlined
                          style={{ marginLeft: 4, color: '#999' }}
                        />
                      </Tooltip>
                    </Radio>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </>
  );
});
