import React, { useState } from 'react';

import { Input } from 'antd';

const { TextArea } = Input;

export interface EventInputProps {
  defaultValue?: string;
}

const EventInput = ({ defaultValue }: EventInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [isValidJson, setIsValidJson] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputValue(value);

    try {
      // 尝试解析 JSON
      JSON.parse(value);
      setIsValidJson(true);
      // 保存到 localStorage
      localStorage.setItem('chatUpdate', value);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
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
