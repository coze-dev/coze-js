import React, { useState } from 'react';

import {
  Modal,
  Form,
  Select,
  Input,
  Upload,
  Button,
  message,
  Tooltip,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface ComfortStrategyFormProps {
  visible: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any, callback?: (values: any) => void) => void;
}

const ComfortStrategyForm: React.FC<ComfortStrategyFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [strategy, setStrategy] = useState<string>();
  const [triggerType, setTriggerType] = useState<string>();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        await onSubmit(values);
        form.resetFields();
        onClose();
      })
      .catch(error => {
        console.error('Validation failed:', error);
        message.error(
          'Failed to submit: Please check your input and try again',
        );
      });
  };

  const handleCopyConfig = () => {
    form
      .validateFields()
      .then(values => {
        onSubmit(values, result => {
          // Copy configuration to clipboard
          const configString = JSON.stringify(result, null, 2);
          navigator.clipboard
            .writeText(configString)
            .then(() => {
              message.success('Configuration copied to clipboard');
            })
            .catch(() => {
              message.error('Failed to copy configuration');
            });
        });
      })
      .catch(error => {
        console.error('Validation failed:', error);
        message.error('Please fill in all required fields before copying');
      });
  };

  return (
    <Modal
      title="Comfort Strategy Configuration"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="copy" onClick={handleCopyConfig}>
          Copy JSON Config
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          OK
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="comfortStrategy"
          label="Message Generation Strategy"
          rules={[
            {
              required: true,
              message: 'Please select a comfort message generation strategy',
            },
          ]}
        >
          <Select
            onChange={value => setStrategy(value)}
            options={[
              { label: 'Audio', value: 'audio' },
              { label: 'Fixed Text', value: 'text' },
              { label: 'Bot Generated Text', value: 'bot' },
            ]}
          />
        </Form.Item>

        {strategy === 'audio' && (
          <Form.Item
            name="audioFile"
            label="Upload Audio File"
            rules={[{ required: true, message: 'Please upload an audio file' }]}
          >
            <Upload beforeUpload={() => false} accept=".wav,.mp3">
              <Button icon={<UploadOutlined />}>
                Select Audio File (WAV/MP3)
              </Button>
            </Upload>
          </Form.Item>
        )}

        {strategy === 'text' && (
          <Form.Item
            name="fixedText"
            label="Fixed Text"
            rules={[{ required: true, message: 'Please enter fixed text' }]}
            extra="Please enter multiple comfort messages, one per line. The system will randomly select one when the comfort strategy is triggered."
          >
            <TextArea
              rows={6}
              placeholder={
                'Please enter comfort messages, one per line, for example:\n' +
                "Don't worry, I'm listening\n" +
                'I understand your thoughts, please continue\n' +
                "You're doing great, please go on"
              }
            />
          </Form.Item>
        )}

        {strategy === 'bot' && (
          <Form.Item name="botId" label="Bot ID">
            <Input />
          </Form.Item>
        )}

        <Form.Item
          name="triggerStrategy"
          label="Trigger Strategy"
          rules={[
            { required: true, message: 'Please select a trigger strategy' },
          ]}
        >
          <Select
            onChange={value => setTriggerType(value)}
            options={[
              {
                label: (
                  <Tooltip title="Will always trigger comfort strategy">
                    mandatory
                  </Tooltip>
                ),
                value: 'mandatory',
              },
              {
                label: (
                  <Tooltip title="Will trigger comfort strategy if model doesn't respond within a time period">
                    time-trigger
                  </Tooltip>
                ),
                value: 'time-trigger',
              },
              {
                label: (
                  <Tooltip title="Will trigger comfort strategy when model triggers a function call">
                    event-driven
                  </Tooltip>
                ),
                value: 'event-driven',
              },
            ]}
          />
        </Form.Item>

        {triggerType === 'time-trigger' && (
          <Form.Item
            name="triggerInterval"
            label="Trigger Interval (ms)"
            rules={[
              { required: true, message: 'Please enter trigger interval' },
              {
                type: 'number',
                min: 0,
                max: 3000,
                message: 'Interval must be between 0-3000 milliseconds',
              },
            ]}
            initialValue={1500}
          >
            <Input type="number" min={0} max={3000} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ComfortStrategyForm;
