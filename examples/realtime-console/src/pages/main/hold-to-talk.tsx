import React, { useRef, useState } from 'react';

import { Button, message } from 'antd';
import { type RealtimeClient } from '@coze/realtime-api';
import { AudioOutlined } from '@ant-design/icons';

import '../../App.css';

const maxRecordingTime = 60; // 最大录音时长（秒）

export default (props: {
  clientRef: React.MutableRefObject<RealtimeClient | null>;
  isConnected?: boolean;
}) => {
  const { clientRef, isConnected } = props;
  const [isPressRecording, setIsPressRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isCancelRecording, setIsCancelRecording] = useState(false);
  const startTouchY = useRef<number>(0);
  const recordTimer = useRef<NodeJS.Timeout | null>(null);

  const handleVoiceButtonMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (isConnected && clientRef.current) {
      startPressRecord(e);
    }
  };

  const handleVoiceButtonMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressRecording && !isCancelRecording) {
      finishPressRecord();
    } else if (isPressRecording && isCancelRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseLeave = () => {
    if (isPressRecording) {
      cancelPressRecord();
    }
  };

  const handleVoiceButtonMouseMove = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (isPressRecording && startTouchY.current) {
      // 上滑超过50px则取消发送
      const clientY =
        'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      if (clientY < startTouchY.current - 50) {
        setIsCancelRecording(true);
      } else {
        setIsCancelRecording(false);
      }
    }
  };

  const startPressRecord = async (e: React.MouseEvent | React.TouchEvent) => {
    try {
      setIsPressRecording(true);
      setRecordingDuration(0);
      setIsCancelRecording(false);
      // Store initial touch position for determining sliding direction
      if ('clientY' in e) {
        startTouchY.current = (e as React.MouseEvent).clientY;
      } else if ('touches' in e && e.touches.length > 0) {
        startTouchY.current = e.touches[0].clientY;
      } else {
        startTouchY.current = 0;
      }

      // 开始录音 TODO
      await clientRef.current?.sendMessage({
        id: `event_${Date.now()}`,
        event_type: 'input_audio_buffer.start',
        data: {},
      });

      recordTimer.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          // 超过最大录音时长自动结束
          if (newDuration >= maxRecordingTime) {
            finishPressRecord();
          }
          return newDuration;
        });
      }, 1000);
    } catch (error: unknown) {
      console.trace(error);
      message.error(`开始录音错误: ${error || '未知错误'}`);
      if (recordTimer.current) {
        clearInterval(recordTimer.current);
        recordTimer.current = null;
      }
      // Reset recording state
      setIsPressRecording(false);
      setRecordingDuration(0);
    }
  };

  const finishPressRecord = async () => {
    if (isPressRecording && clientRef.current) {
      try {
        // 停止计时
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 如果录音时间太短（小于1秒），视为无效
        if (recordingDuration < 1) {
          cancelPressRecord();
          return;
        }

        // 停止录音并发送 TODO

        await clientRef.current?.sendMessage({
          id: `event_${Date.now()}`,
          event_type: 'input_audio_buffer.complete',
          data: {},
        });

        setIsPressRecording(false);

        // 显示提示
        message.success(`发送了 ${recordingDuration} 秒的语音消息`);
      } catch (error: unknown) {
        message.error(`结束录音错误: ${error || '未知错误'}`);
        console.error('结束录音错误:', error);
      }
    }
  };

  const cancelPressRecord = async () => {
    if (isPressRecording && clientRef.current) {
      try {
        if (recordTimer.current) {
          clearInterval(recordTimer.current);
          recordTimer.current = null;
        }

        // 取消录音 TODO
        await clientRef.current?.sendMessage({
          id: `event_${Date.now()}`,
          event_type: 'input_audio_buffer.complete',
          data: {},
        });

        setIsPressRecording(false);
        setIsCancelRecording(false);

        // 显示提示
        message.info('取消了语音消息');
      } catch (error: unknown) {
        message.error(`取消录音错误: ${error || '未知错误'}`);
        console.error('取消录音错误:', error);
      }
    }
  };

  return (
    <Button
      color="default"
      onMouseDown={handleVoiceButtonMouseDown}
      onMouseUp={handleVoiceButtonMouseUp}
      onMouseLeave={handleVoiceButtonMouseLeave}
      onMouseMove={handleVoiceButtonMouseMove}
      onTouchStart={handleVoiceButtonMouseDown}
      onTouchEnd={handleVoiceButtonMouseUp}
      onTouchCancel={handleVoiceButtonMouseLeave}
      onTouchMove={handleVoiceButtonMouseMove}
      size="middle"
      icon={<AudioOutlined />}
    >
      {isPressRecording ? 'Release and send' : 'Hold to talk'}
    </Button>
  );
};
