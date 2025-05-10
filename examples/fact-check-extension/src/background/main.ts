// 导入 API 模块
import * as api from '../utils/api';

// Background script for the Fact Check Extension
function init() {
  console.log('Fact Check Extension background script initialized');

  // 在扩展安装或更新时创建右键菜单
  chrome.runtime.onInstalled.addListener(() => {
    // 先移除现有的右键菜单项目以避免重复创建
    chrome.contextMenus.removeAll(() => {
      // 创建右键菜单 (注意：菜单图标使用扩展自身的图标)
      chrome.contextMenus.create({
        id: 'factCheckSelectedText',
        title: '事实核查',
        contexts: ['selection'],
      });
    });
  });

  // 添加右键菜单点击事件监听
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'factCheckSelectedText' && info.selectionText) {
      // 保存选中的文本
      chrome.storage.local.set({ selectedText: info.selectionText }, () => {
        console.log('Selected text saved:', info.selectionText);
      });

      // 打开验证结果页面
      if (tab?.id) {
        // 先检查内容脚本是否已加载，然后再发送消息
        try {
          chrome.tabs.sendMessage(tab.id, { action: 'checkPage' }, response => {
            if (chrome.runtime.lastError) {
              // 处理错误 - 内容脚本可能没有加载或回应
              console.log('Error:', chrome.runtime.lastError.message);
              // 备用方案
              chrome.storage.local.set({
                pendingVerification: info.selectionText,
              });
              chrome.action.openPopup();
              return;
            }

            // 如果收到响应，说明内容脚本已加载
            if (response) {
              // 向内容脚本发送消息，显示验证结果弹窗
              if (tab.id) {
                // TypeScript需要再次检查tab.id是否存在
                chrome.tabs.sendMessage(tab.id, {
                  action: 'showVerificationPopup',
                  text: info.selectionText,
                });
              }
            } else {
              // 如果内容脚本未加载，显示通知
              console.log('Content script not loaded in this tab');
              // 可以执行其他备选行为，比如在新标签页中打开插件的验证页面
              chrome.storage.local.set({
                pendingVerification: info.selectionText,
              });
              chrome.action.openPopup();
            }
          });
        } catch (error: unknown) {
          // 处理异常
          console.error('Exception connecting to content script:', error);
          chrome.storage.local.set({ pendingVerification: info.selectionText });
          chrome.action.openPopup();
        }
      }
    }
  });
}

// 处理来自内容脚本和弹出窗口的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message);
  if (message.action === 'factCheckText') {
    // 处理事实核查请求
    console.log('Fact-checking text:', message.text);

    // 首先发送一个中间响应，避免消息通道超时关闭
    sendResponse({ status: 'processing' });

    // 使用api.ts中定义的流式验证函数
    try {
      // 判断消息来源（弹出窗口或内容脚本）
      const isFromPopup = !sender.tab;
      const tabId = sender.tab?.id;

      // 确保设置了客户端 ID和Bot ID
      chrome.storage.local.get(['apiKey', 'botId'], result => {
        if (!result.apiKey || !result.botId) {
          // 使用弹出窗口的消息传递机制回传信息
          if (isFromPopup) {
            chrome.runtime.sendMessage({
              action: 'factCheckTextResult',
              error: 'API Key或Bot ID未设置，请在设置中配置',
            });
          } else if (tabId) {
            chrome.tabs.sendMessage(tabId, {
              action: 'updateFactCheckResult',
              result: 'API Key或Bot ID未设置，请在设置中配置',
              type: 'complete',
            });
          }

          return;
        }

        // 如果是内容脚本发送的消息，需要tabId
        if (!isFromPopup && !tabId) {
          chrome.runtime.sendMessage({
            action: 'factCheckTextResult',
            error: '无法确定来源标签页',
          });
          return;
        }

        // 不同消息来源的处理逻辑
        let factCheckResult = '';
        let isFirst = true;

        // 开始核查
        api.factCheckNewsStreaming(
          result.apiKey,
          result.botId,
          message.text,
          // 开始回调
          () => {
            if (isFromPopup) {
              factCheckResult = '';
            } else if (tabId) {
              chrome.tabs.sendMessage(tabId, {
                action: 'updateFactCheckResult',
                result: '正在分析内容...',
                type: 'complete',
              });
            }
          },
          // 流式内容回调
          content => {
            if (isFromPopup) {
              factCheckResult += content;
              chrome.runtime.sendMessage({
                action: 'factCheckTextResult',
                result: factCheckResult,
              });
            } else if (tabId) {
              chrome.tabs.sendMessage(tabId, {
                action: 'updateFactCheckResult',
                result: content,
                type: 'stream',
                isFirst,
              });
            }
            isFirst = false;
          },
          // 错误回调
          error => {
            const errorMsg = `核查过程中发生错误: ${error}`;
            if (isFromPopup) {
              chrome.runtime.sendMessage({
                action: 'factCheckTextResult',
                error: errorMsg,
              });
            } else if (tabId) {
              chrome.tabs.sendMessage(tabId, {
                action: 'updateFactCheckResult',
                result: errorMsg,
                type: 'complete',
              });
            }
          },
        );
      });
    } catch (error) {
      console.error('加载API模块失败:', error);
      chrome.runtime.sendMessage({
        action: 'factCheckTextResult',
        error: '加载API模块失败',
      });
    }

    // 返回true表示将异步发送响应
    return true;
  }
});

// Initialize the background script
init();
