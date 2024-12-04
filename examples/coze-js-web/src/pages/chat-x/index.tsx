import React, { useEffect } from 'react';

import { Badge, Button, type GetProp, message, Space } from 'antd';
import { type CreateChatData } from '@coze/api';
import { type MessageInfo } from '@ant-design/x/es/useXChat';
import {
  Attachments,
  Bubble,
  Conversations,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import {
  CloudUploadOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import useStyles from './use-style';
import useCozeAPI from './use-coze-api';
import Settings from './settings';
import logo from './logo.svg';
import { config } from './config';

interface Conversation {
  key: string;
  label: string;
}
const getRoles = (typing: boolean): GetProp<typeof Bubble.List, 'roles'> => ({
  ai: {
    placement: 'start',
    typing: typing ? { step: 5, interval: 20 } : false,
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
});

const ChatX: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyles();

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [conversationsItems, setConversationsItems] = React.useState<
    Conversation[]
  >([]);

  const activeKeyRef = React.useRef<string | undefined>();

  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, 'items'>
  >([]);

  const messageMap = React.useRef<Map<string, MessageInfo<string>[]>>(
    new Map(),
  );
  const isTypingRef = React.useRef(false);

  const {
    initClient,
    streamingChat,
    botInfo,
    getBotInfo,
    uploadFile,
    uploading,
  } = useCozeAPI();

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: ({ message: query }, { onUpdate, onSuccess }) => {
      const conversationId = activeKeyRef.current || '0';
      isTypingRef.current = true;
      streamingChat({
        query: query ?? '',
        conversationId: conversationId === '0' ? undefined : conversationId,
        onUpdate,
        onSuccess: (delta: string) => {
          onSuccess(delta);
          isTypingRef.current = false;
        },
        onCreated: (data: CreateChatData) => {
          setConversationsItems(prev => {
            const exist = prev.find(
              item => item.key === data.conversation_id || item.key === '0',
            );
            activeKeyRef.current = data.conversation_id;

            if (!exist) {
              return [
                ...prev,
                {
                  key: data.conversation_id,
                  label: query ?? '',
                },
              ];
            } else {
              if (exist.key === '0') {
                const newConversationsItems = prev.map(item => {
                  if (item.key === '0') {
                    return { key: data.conversation_id, label: query ?? '' };
                  }
                  return item;
                });

                return newConversationsItems;
              }
              return prev;
            }
          });
        },
      });
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  useEffect(() => {
    const baseUrl = config.getBaseUrl();
    const pat = config.getPat();
    const botId = config.getBotId();

    if (baseUrl && pat && botId) {
      initClient();
      getBotInfo();
    } else {
      message.error('Please set the base URL, PAT, bot ID and voice file ID');
    }
  }, []);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) {
      return;
    }
    onRequest(nextContent);
    setContent('');
  };

  const onAddConversation = () => {
    if (conversationsItems.find(item => item.key === '0')) {
      message.error("Don't create more than one empty conversation");
      return;
    }
    if (activeKeyRef.current) {
      messageMap.current.set(activeKeyRef.current, messages);
    }

    setConversationsItems(prev => [
      ...prev,
      {
        key: '0',
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
    activeKeyRef.current = '0';
    setMessages([]);
  };

  const onConversationClick: GetProp<
    typeof Conversations,
    'onActiveChange'
  > = key => {
    if (activeKeyRef.current) {
      messageMap.current.set(activeKeyRef.current, messages);
    }

    activeKeyRef.current = key;

    if (messageMap.current.has(key)) {
      setMessages(messageMap.current.get(key) || []);
    } else {
      setMessages([]);
    }
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = info => {
    setAttachedFiles(info.fileList);
    uploadFile(info.fileList[0]?.originFileObj as File);
  };

  const onSettingsChange = () => {
    initClient();
    getBotInfo();
  };

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon={botInfo?.icon_url}
        title={botInfo?.name}
        description={botInfo?.description}
        extra={
          <Space>
            <Settings onSettingsChange={onSettingsChange} />
          </Space>
        }
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message: msg, status }) => ({
      key: id,
      role: status === 'local' ? 'local' : 'ai',
      content: msg,
    }),
  );

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={type =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
      />
    </Sender.Header>
  );

  const logoNode = (
    <div className={styles.logo}>
      <img src={logo} draggable={false} alt="logo" />
      <span>Chat</span>
    </div>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 Add Conversation */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button>
        {/* 🌟 Conversation Management */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKeyRef.current}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={
            items.length > 0
              ? items
              : [{ content: placeholderNode, variant: 'borderless' }]
          }
          roles={getRoles(isTypingRef.current)}
          className={styles.messages}
        />
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={attachmentsNode}
          loading={agent.isRequesting() || uploading}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default ChatX;
