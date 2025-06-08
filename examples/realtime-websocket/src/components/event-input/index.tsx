/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

import { Input, Select, Form } from 'antd';
import { WsToolsUtils } from '@coze/api/ws-tools';
import { CozeAPI } from '@coze/api';
import type { VoiceprintGroup } from '@coze/api';

import getConfig from '../../utils/config';

const { TextArea } = Input;
const localStorageKey = 'realtime-quickstart-ws';
const config = getConfig(localStorageKey);

export interface EventInputProps {
  defaultValue?: string;
}

const EventInput = ({ defaultValue }: EventInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [isValidJson, setIsValidJson] = useState(true);
  const [loadingVoiceprintGroups, setLoadingVoiceprintGroups] = useState(false);
  const [voiceprintGroups, setVoiceprintGroups] = useState<VoiceprintGroup[]>(
    [],
  );
  const voiceprintGroupId = config.getChatUpdate()?.data?.voice_print_group_id;
  const turnDetection = config.getChatUpdate()?.data?.turn_detection?.type;

  // 获取声纹组列表
  useEffect(() => {
    const fetchVoiceprintGroups = async () => {
      try {
        setLoadingVoiceprintGroups(true);
        const api = new CozeAPI({
          token: config.getPat(),
          baseURL: config.getBaseWsUrl().replace('wss://ws', 'https://api'),
          allowPersonalAccessTokenInBrowser: true,
        });
        const response = await api.audio.voiceprintGroups.list({
          page_num: 1,
          page_size: 1000,
        });
        if (response?.items?.length) {
          setVoiceprintGroups(response.items);
        }
      } catch (error) {
        console.error('Failed to fetch voice print groups:', error);
      } finally {
        setLoadingVoiceprintGroups(false);
      }
    };

    fetchVoiceprintGroups();
  }, []);

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

  const handleVoicePrintGroupChange = (value: string | undefined) => {
    try {
      // 更新 JSON 中的声纹组 ID
      const parsedJson = JSON.parse(inputValue);
      WsToolsUtils.setValueByPath(
        parsedJson,
        'data.voice_print_group_id',
        value,
      );
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setInputValue(updatedJson);
      localStorage.setItem('chatUpdate', updatedJson);
    } catch (error) {
      console.error('Failed to update voice print group ID in JSON:', error);
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

  return (
    <div style={{ padding: '24px' }}>
      <Form.Item name="turn_detection" label="对话模式">
        <Select
          prefix={<span>对话模式</span>}
          defaultValue={turnDetection || 'server_vad'}
          onChange={handleTurnDetectionChange}
          options={[
            { label: '自由对话模式', value: 'server_vad' },
            { label: '按键说话模式', value: 'client_interrupt' },
          ]}
        />
      </Form.Item>

      <Form.Item name="voice_print_group_id" label="声纹组 ID">
        <Select
          loading={loadingVoiceprintGroups}
          defaultValue={voiceprintGroupId}
          showSearch
          onChange={handleVoicePrintGroupChange}
          allowClear
          placeholder="请选择声纹组"
          filterOption={(input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={voiceprintGroups.map(group => ({
            label: group.name,
            value: group.id,
          }))}
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
