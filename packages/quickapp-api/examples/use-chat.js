/**
 * 聊天客户端示例
 * 展示如何使用WsChatClient进行WebSocket聊天
 */

// 导入WsChatClient
import { WsChatClient } from '@coze/quickapp-api/ws-tools';

/**
 * 创建聊天功能
 * @param {Object} options - 配置选项
 * @param {string} options.token - Coze API令牌
 * @param {boolean} [options.debug=false] - 是否启用调试模式
 * @returns {Object} - 聊天控制对象
 */
export function useChat(options) {
  // 创建聊天客户端实例
  const chatClient = new WsChatClient({
    token: options.token,
    debug: options.debug || false,
  });

  // 状态变量
  let isConnected = false;
  let messages = [];
  let connectionStatusCallback = null;
  let messageCallback = null;
  let errorCallback = null;

  /**
   * 连接WebSocket
   * @returns {Promise<void>}
   */
  async function connect() {
    if (isConnected) {
      return;
    }

    try {
      await chatClient.connect();
      isConnected = true;

      // 触发连接状态回调
      if (connectionStatusCallback) {
        connectionStatusCallback({
          isConnected,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 断开WebSocket连接
   */
  function disconnect() {
    if (!isConnected) {
      return;
    }

    try {
      chatClient.close();
      isConnected = false;

      // 触发连接状态回调
      if (connectionStatusCallback) {
        connectionStatusCallback({
          isConnected,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 发送消息
   * @param {Object} params - 消息参数
   * @param {string} params.text - 消息文本
   * @param {string} [params.type='chat.message'] - 消息类型
   * @param {Object} [params.metadata] - 消息元数据
   * @returns {Promise<void>}
   */
  async function sendMessage(params) {
    if (!isConnected) {
      throw new Error('WebSocket未连接');
    }

    if (!params || !params.text) {
      throw new Error('消息文本不能为空');
    }

    try {
      const messageData = {
        type: params.type || 'chat.message',
        data: {
          text: params.text,
          ...(params.metadata ? { metadata: params.metadata } : {}),
        },
      };

      await chatClient.send(messageData);

      // 添加到消息列表
      const message = {
        id: Date.now().toString(),
        text: params.text,
        type: 'sent',
        timestamp: new Date().toISOString(),
        metadata: params.metadata,
      };

      messages.push(message);

      // 触发消息回调
      if (messageCallback) {
        messageCallback({
          messages: [...messages],
          lastMessage: message,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 清理资源
   */
  function destroy() {
    try {
      chatClient.destroy();
      isConnected = false;
      messages = [];

      // 触发连接状态回调
      if (connectionStatusCallback) {
        connectionStatusCallback({
          isConnected,
        });
      }

      // 触发消息回调
      if (messageCallback) {
        messageCallback({
          messages: [],
          lastMessage: null,
        });
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  /**
   * 设置连接状态回调
   * @param {Function} callback - 连接状态回调函数
   */
  function onConnectionStatus(callback) {
    connectionStatusCallback = callback;

    // 监听关闭事件
    chatClient.on('close', () => {
      isConnected = false;

      // 触发连接状态回调
      if (connectionStatusCallback) {
        connectionStatusCallback({
          isConnected,
        });
      }
    });
  }

  /**
   * 设置消息回调
   * @param {Function} callback - 消息回调函数
   */
  function onMessage(callback) {
    messageCallback = callback;

    // 监听消息事件
    chatClient.on('chat.message', data => {
      if (data && data.data && data.data.text) {
        // 添加到消息列表
        const message = {
          id: data.id || Date.now().toString(),
          text: data.data.text,
          type: 'received',
          timestamp: new Date().toISOString(),
          metadata: data.data.metadata,
        };

        messages.push(message);

        // 触发消息回调
        if (messageCallback) {
          messageCallback({
            messages: [...messages],
            lastMessage: message,
          });
        }
      }
    });
  }

  /**
   * 设置错误回调
   * @param {Function} callback - 错误回调函数
   */
  function onError(callback) {
    errorCallback = callback;

    // 监听错误事件
    chatClient.on('error', error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
  }

  /**
   * 获取所有消息
   * @returns {Array} - 消息列表
   */
  function getMessages() {
    return [...messages];
  }

  /**
   * 获取连接状态
   * @returns {Object} - 连接状态
   */
  function getConnectionStatus() {
    return {
      isConnected,
    };
  }

  /**
   * 清空消息
   */
  function clearMessages() {
    messages = [];

    // 触发消息回调
    if (messageCallback) {
      messageCallback({
        messages: [],
        lastMessage: null,
      });
    }
  }

  // 返回控制对象
  return {
    connect,
    disconnect,
    sendMessage,
    destroy,
    onConnectionStatus,
    onMessage,
    onError,
    getMessages,
    getConnectionStatus,
    clearMessages,
  };
}

export default useChat;
