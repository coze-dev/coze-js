import React, { useState, useEffect } from 'react';

import { Button, Modal, Form, Input, message } from 'antd';

const { TextArea } = Input;

interface MessageFormProps {
  onSubmit: (values: { eventData: string }) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Load saved data from localStorage when component mounts
    const savedEventData = localStorage.getItem('savedEventData');

    if (savedEventData) {
      form.setFieldsValue({
        eventData: savedEventData || '',
      });
    }
  }, [form]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);

      // Save form data to localStorage
      localStorage.setItem('savedEventData', values.eventData);

      hideModal();
      // form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Failed to submit: Please check your input and try again');
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Send Message
      </Button>
      <Modal
        open={visible}
        title="Send Message"
        onCancel={hideModal}
        onOk={handleSubmit}
        aria-label="Send Message Form"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="eventData"
            label="Event Data"
            aria-label="Event Data Input"
            rules={[
              { required: true, message: 'Please enter event data' },
              {
                validator: (_, value) => {
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(
                      new Error('Please enter valid JSON format'),
                    );
                  }
                },
              },
            ]}
          >
            <TextArea
              placeholder="Enter event data"
              rows={4}
              autoSize={{ minRows: 8, maxRows: 10 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MessageForm;
