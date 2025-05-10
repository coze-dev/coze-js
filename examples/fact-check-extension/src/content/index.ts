// Content script for the Fact Check Extension
console.log('Fact Check Extension: Content script loaded');
console.log('Fact Check Extension initialized on page:', window.location.href);

// 创建验证结果弹窗的函数
function createVerificationPopup(selectedText: string) {
  // 移除任何已存在的弹窗
  const existingPopup = document.getElementById('fact-check-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // 创建弹窗容器
  const popup = document.createElement('div');
  popup.id = 'fact-check-popup';
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.right = '20px';
  popup.style.width = '400px';
  popup.style.maxHeight = '600px';
  popup.style.overflow = 'auto';
  // 适配暗黑模式
  // 强制 light mode 样式
  popup.style.background = 'white';
  popup.style.color = '#222';
  popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '10000';
  popup.style.padding = '16px';
  popup.style.fontFamily = 'Arial, sans-serif';

  // 标题
  const title = document.createElement('div');
  title.textContent = '事实核查';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '18px';
  title.style.marginBottom = '12px';
  title.style.display = 'flex';
  title.style.justifyContent = 'space-between';
  title.style.alignItems = 'center';
  popup.appendChild(title);

  // 关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.border = 'none';
  closeButton.style.background = 'none';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => popup.remove();
  title.appendChild(closeButton);

  // 内容容器
  const contentContainer = document.createElement('div');
  contentContainer.id = 'fact-check-content';
  popup.appendChild(contentContainer);

  // 显示正在验证中的消息
  const loadingMessage = document.createElement('div');
  loadingMessage.textContent = '正在分析文本内容，请稍候...';
  loadingMessage.style.padding = '12px';
  contentContainer.appendChild(loadingMessage);

  // 追加到body前插入样式，强制 light mode 链接颜色
  const style = document.createElement('style');
  style.textContent = `
    #fact-check-popup a {
      color: #2563eb;
    }
  `;
  document.head.appendChild(style);

  // 追加到body
  document.body.appendChild(popup);

  // 发送消息到popup组件进行API调用
  chrome.runtime.sendMessage(
    {
      action: 'factCheckText',
      text: selectedText,
    },
    response => {
      if (response && response.error) {
        contentContainer.innerHTML = `<div style="color: red;">验证失败: ${response.error}</div>`;
      }
    },
  );

  return contentContainer;
}

// 添加来自background脚本消息的事件监听器
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('message2', message);
  if (message.action === 'checkPage') {
    console.log('Checking page content for verification');
    sendResponse({ status: 'success', url: window.location.href });
  } else if (message.action === 'showVerificationPopup' && message.text) {
    // 创建验证结果弹窗
    createVerificationPopup(message.text);
    sendResponse({ status: 'success', contentContainer: true });
  } else if (message.action === 'updateFactCheckResult' && message.result) {
    // 更新弹窗中的验证结果
    const contentContainer = document.getElementById('fact-check-content');
    if (contentContainer) {
      // 如果是第一次输出或非流式输出，清空容器
      if (message.isFirst || message.type !== 'stream') {
        contentContainer.innerHTML = '';
      }

      // 创建一个临时的存储元素，用于累积Markdown内容
      if (!contentContainer.dataset.markdownContent) {
        contentContainer.dataset.markdownContent = '';
      }

      if (message.type === 'stream') {
        // 累积Markdown内容
        contentContainer.dataset.markdownContent += message.result;

        try {
          // 使用DOMPurify净化HTML（防止XSS攻击）
          // 这里我们直接用累积的内容生成完整的HTML，而不是增量添加
          // 因为Markdown需要完整解析才能正确显示格式
          const renderer = new DOMParser();
          const doc = renderer.parseFromString(
            `<div>${contentContainer.dataset.markdownContent}</div>`,
            'text/html',
          );

          // 处理Markdown格式（简单处理，实际项目中使用marked库）
          // 1. 处理标题
          const processedHtml = doc.body.innerHTML
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            // 2. 处理粗体和斜体
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // 3. 处理链接
            .replace(
              /\[(.+?)\]\((.+?)\)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
            )
            // 4. 处理列表
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            // 5. 处理段落和换行
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

          // 更新容器内容
          contentContainer.innerHTML = processedHtml;
        } catch (e) {
          console.error('Markdown渲染错误', e);
          // 出错时降级为纯文本显示
          contentContainer.innerText = contentContainer.dataset.markdownContent;
        }
      } else {
        // 完整替换内容（非流式）
        try {
          // 同样进行Markdown格式化处理
          const processedHtml = message.result
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(
              /\[(.+?)\]\((.+?)\)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
            )
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

          contentContainer.innerHTML = `<div>${processedHtml}</div>`;
        } catch (e) {
          console.error('Markdown渲染错误', e);
          contentContainer.innerText = message.result;
        }
      }
    }
    sendResponse({ status: 'success' });
  }
  return true;
});
