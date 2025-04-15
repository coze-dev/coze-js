import React, { useState } from 'react';

import { Input, Select, Typography } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

export interface EventInputProps {
  defaultValue?: string;
}

const EventInput = ({ defaultValue }: EventInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [isValidJson, setIsValidJson] = useState(true);
  const [ppe, setPpe] = useState(() => localStorage.getItem('ppe') || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputValue(value);

    try {
      // 尝试解析 JSON
      JSON.parse(value);
      setIsValidJson(true);
      // 保存到 localStorage
      localStorage.setItem('simultUpdate', value);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handlePpeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPpe(value);
    localStorage.setItem('simultPpe', value);
  };

  const handleDirectionChange = (value: string) => {
    const simultUpdate = JSON.parse(
      localStorage.getItem('simultUpdate') || defaultValue || '{}',
    );
    if (!simultUpdate.data) {
      simultUpdate.data = {};
    }
    if (!simultUpdate.data.translate_config) {
      simultUpdate.data.translate_config = {};
    }

    simultUpdate.data.translate_config.from = value === 'zh2en' ? 'zh' : 'en';
    simultUpdate.data.translate_config.to = value === 'zh2en' ? 'en' : 'zh';

    localStorage.setItem('simultUpdate', JSON.stringify(simultUpdate, null, 2));

    setInputValue(JSON.stringify(simultUpdate, null, 2));
  };

  // 处理音色ID变化
  const handleVoiceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const simultUpdate = JSON.parse(
      localStorage.getItem('simultUpdate') || defaultValue || '{}',
    );
    if (!simultUpdate.data) {
      simultUpdate.data = {};
    }
    if (!simultUpdate.data.output_audio) {
      simultUpdate.data.output_audio = {};
    }
    simultUpdate.data.output_audio.voice_id = value;
    localStorage.setItem('simultUpdate', JSON.stringify(simultUpdate, null, 2));

    setInputValue(JSON.stringify(simultUpdate, null, 2));
  };

  const from =
    JSON.parse(localStorage.getItem('simultUpdate') || '{}')?.data
      ?.translate_config?.from || 'zh';
  const to =
    JSON.parse(localStorage.getItem('simultUpdate') || '{}')?.data
      ?.translate_config?.to || 'en';

  const translationDirection = from === 'zh' && to === 'en' ? 'zh2en' : 'en2zh';

  const voiceId =
    JSON.parse(localStorage.getItem('simultUpdate') || '{}')?.data?.output_audio
      ?.voice_id || '';

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Typography.Text>方向：</Typography.Text>
        <Select
          defaultValue="zh2en"
          style={{ width: 200 }}
          onChange={handleDirectionChange}
          value={translationDirection}
        >
          <Option value="zh2en">中文 -&gt; 英文</Option>
          <Option value="en2zh">英文 -&gt; 中文</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <Typography.Text>音色：</Typography.Text>
        <Input
          placeholder="请输入音色ID"
          value={voiceId}
          style={{ width: 200 }}
          onChange={handleVoiceIdChange}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <Typography.Text>PPE：</Typography.Text>
        <Input
          placeholder="测试环境"
          value={ppe}
          style={{ width: 200 }}
          onChange={handlePpeChange}
        />
      </div>
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
