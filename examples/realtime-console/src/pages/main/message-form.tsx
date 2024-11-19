import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { Button, Modal, Form, Input, message } from 'antd';

const { TextArea } = Input;

// Add ref interface
export interface MessageFormRef {
  showModal: (eventData?: string, functionCall?: string) => void;
  hideModal: () => void;
}

interface MessageFormProps {
  onSubmit: (values: { eventData: string }) => void;
}

// Convert to forwardRef and add ref type
const MessageForm = forwardRef<MessageFormRef, MessageFormProps>(
  ({ onSubmit }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = (eventData?: string, functionCall?: string) => {
      if (eventData) {
        form.setFieldsValue({
          eventData,
          functionCall,
        });
      }
      setVisible(true);
    };
    const hideModal = () => setVisible(false);
    // Add useImperativeHandle
    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    useEffect(() => {
      // Load saved data from localStorage when component mounts
      const savedEventData = localStorage.getItem('savedEventData');

      if (savedEventData) {
        form.setFieldsValue({
          eventData: savedEventData,
        });
      }
    }, [form]);

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
        message.error(
          'Failed to submit: Please check your input and try again',
        );
      }
    };

    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            showModal();
          }}
        >
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
            {form.getFieldValue('functionCall') && (
              <Form.Item
                name="functionCall"
                label="Function Call"
                aria-label="Function Call Input"
              >
                <TextArea
                  rows={4}
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  readOnly
                />
              </Form.Item>
            )}
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
  },
);

export default MessageForm;
