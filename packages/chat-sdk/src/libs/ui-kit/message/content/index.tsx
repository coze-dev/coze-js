import { FC } from 'react';

import { safeJSONParse } from '@/libs/utils';
import { IMessageContentProps } from '@/libs/types';
import { useI18n } from '@/libs/provider';

import { extractChatflowMessage } from '../helper/extract-chatlow-message';
import { TextMessage } from '../components/text';
import { MarkdownMessage } from '../components/markdown';
import { ImageMessage } from '../components/image';
import { FileMessage } from '../components/file';
import { ChatflowNode } from '../components/chatflow-node';
import { ErrorBoundary } from '../../atomic/error-boundary';
type ObjectStringItem =
  | { type: 'text'; text: string }
  | { type: 'file'; file_id: string; name?: string; size?: number }
  | { type: 'file'; file_url: string; name?: string; size?: number }
  | { type: 'image'; file_id: string; file_url?: string }
  | { type: 'image'; file_url: string }
  | { type: 'audio'; file_id: string }
  | { type: 'audio'; file_url: string };
const getObjectValue = (objectString: string) =>
  safeJSONParse<ObjectStringItem[]>(objectString, []);

export const MessageContent: FC<IMessageContentProps> = props => {
  const { message, isAWaiting } = props;
  const i18n = useI18n();
  return (
    <ErrorBoundary
      fallbackNode={
        !isAWaiting ? <TextMessage content={i18n.t('noAnswer')} /> : <></>
      }
    >
      {/** 文本消息处理， 分为： markdown, text */}
      {message.content_type === 'text' ? <TextItem {...props} /> : null}

      {/** 其他消息处理 */}
      {message.content_type === 'object_string' ? (
        <ObjectStringItem {...props} />
      ) : null}
      {message.content_type === 'card' ? <CardItem {...props} /> : null}
    </ErrorBoundary>
  );
};

const TextItem: FC<IMessageContentProps> = props => {
  const {
    message,
    isAWaiting,
    onImageClick,
    onLinkClick,
    onTaskChange,
    messageUiConfigMap,
    isLastMessage,
  } = props;
  const { renderMessage } = messageUiConfigMap?.text || {};
  if (message.content_type !== 'text') {
    return null;
  }

  return (
    <>
      {renderMessage?.(props) || (
        <>
          {message.type === 'question' ? (
            <TextMessage
              content={message.content}
              isLoadingText={message.isAudioTranslatingToText}
            />
          ) : (
            <MarkdownMessage
              reasoningContent={message.reasoning_content}
              content={message.content}
              isComplete={!isAWaiting || message.isComplete}
              onImageClick={onImageClick}
              onLinkClick={onLinkClick}
              onTaskChange={onTaskChange}
              taskDisabled={!isLastMessage}
            />
          )}
        </>
      )}
    </>
  );
};
const ObjectStringItem: FC<IMessageContentProps> = props => {
  const {
    message,
    onImageClick,
    messageUiConfigMap,
    onTaskChange,
    isLastMessage,
  } = props;
  const i18n = useI18n();
  const { renderMessage } = messageUiConfigMap?.text || {};
  if (message.content_type !== 'object_string') {
    return null;
  }
  return (
    <>
      {renderMessage?.(props) ||
        getObjectValue(message.content)?.map((item, index) => {
          switch (item.type) {
            case 'text': {
              return (
                <>
                  {message.type === 'question' ? (
                    <TextMessage
                      content={item.text}
                      isLoadingText={message.isAudioTranslatingToText}
                    />
                  ) : (
                    <MarkdownMessage
                      content={item.text}
                      isComplete={true}
                      onImageClick={onImageClick}
                      onTaskChange={onTaskChange}
                      taskDisabled={!isLastMessage}
                    />
                  )}
                </>
              );
            }
            case 'file': {
              return (
                <FileMessage
                  filename={item.name || ''}
                  key={`${item.type}_${index}`}
                  size={item.size || 0}
                />
              );
            }
            case 'image': {
              return (
                <ImageMessage
                  url={item.file_url as string}
                  onImageClick={onImageClick}
                  key={`${item.type}_${index}`}
                />
              );
            }
            default: {
              return (
                <TextMessage
                  content={i18n.t('messageTypeUnSupport')}
                  key={`${item.type}_${index}`}
                />
              );
            }
          }
        })}
    </>
  );
};
const CardItem: FC<IMessageContentProps> = props => {
  const {
    message,
    messageUiConfigMap,
    sendTextMessage,
    isLastMessage,
    isReadOnly,
  } = props;
  const { renderMessage: renderCardMessage } = messageUiConfigMap?.card || {};
  const { renderMessage: renderChatflowNodeMessage } =
    messageUiConfigMap?.chatflow_node || {};
  const chatflowNodeData = extractChatflowMessage(message);
  const isChatflowNode = Boolean(chatflowNodeData);
  if (message.content_type !== 'card') {
    return null;
  }

  return (
    <>
      {isChatflowNode
        ? renderChatflowNodeMessage?.(props) || (
            <ChatflowNode
              message={message}
              sendTextMessage={sendTextMessage}
              disabled={!isLastMessage || isReadOnly}
            />
          )
        : renderCardMessage?.(props) || null}
    </>
  );
};
