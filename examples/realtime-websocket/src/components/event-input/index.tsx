import React, { useState } from 'react';

import { Input, Select, Form } from 'antd';
import { WsToolsUtils } from '@coze/api/ws-tools';

import getConfig from '../../utils/config';

const { TextArea } = Input;
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

export interface EventInputProps {
  defaultValue?: string;
}
// 从 JSON 中获取当前配置的回复模式
function getReplyModeFromJson(): 'stream' | 'sentence' {
  return localStorage.getItem('replyMode') === 'sentence'
    ? 'sentence'
    : 'stream';
}

const EventInput = ({ defaultValue }: EventInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [isValidJson, setIsValidJson] = useState(true);
  const turnDetection = config.getChatUpdate()?.data?.turn_detection?.type;

  // 添加回复模式配置，默认为流式模式（stream）
  const [replyMode, setReplyMode] = useState<'stream' | 'sentence'>(
    getReplyModeFromJson(),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputValue(value);

    try {
      // 尝试解析 JSON 确认格式正确
      JSON.parse(value);
      setIsValidJson(true);
      // 保存到 localStorage
      localStorage.setItem('chatUpdate', value);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handleTurnDetectionChange = (value: string | undefined) => {
    try {
      // 更新 JSON 中的对话模式
      const parsedJson = JSON.parse(inputValue);
      WsToolsUtils.setValueByPath(
        parsedJson,
        'data.turn_detection.type',
        value,
      );
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setInputValue(updatedJson);
      localStorage.setItem('chatUpdate', updatedJson);
    } catch (error) {
      console.error('Failed to update turn detection in JSON:', error);
    }
  };

  // 处理回复模式变更
  const handleReplyModeChange = (value: 'stream' | 'sentence') => {
    setReplyMode(value);
    localStorage.setItem('replyMode', value);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Form.Item name="turn_detection" label="对话模式">
        <Select
          defaultValue={turnDetection || 'server_vad'}
          onChange={handleTurnDetectionChange}
          options={[
            { label: '自由对话模式', value: 'server_vad' },
            { label: '按键说话模式', value: 'client_interrupt' },
          ]}
        />
      </Form.Item>
      <Form.Item name="reply_mode" label="回复模式">
        <Select
          defaultValue={replyMode}
          onChange={handleReplyModeChange}
          options={[
            { label: '流式模式', value: 'stream' },
            { label: '字幕同步', value: 'sentence' },
          ]}
        />
      </Form.Item>
      <TextArea
        value={inputValue}
        onChange={handleInputChange}
        rows={10}
        status={isValidJson ? '' : 'error'}
        placeholder="请输入 JSON 数据"
      />
    </div>
  );
};

export default EventInput;
