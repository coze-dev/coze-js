/* eslint-disable @typescript-eslint/no-explicit-any */
console.log('Background script loaded');

// Track current PPE value
let currentPpe = '';

// Function to update the network request rules with the PPE value
const updatePpeRules = (ppeValue: string) => {
  console.log('Updating PPE rules with value:', ppeValue);

  // Use declarativeNetRequest API to modify headers
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1], // remove existing rules
    addRules: ppeValue
      ? [
          {
            id: 1,
            priority: 1,
            action: {
              type: 'modifyHeaders' as any,
              requestHeaders: [
                {
                  header: 'X-TT-ENV',
                  operation: 'set' as any,
                  value: ppeValue,
                },
                {
                  header: 'x-use-ppe',
                  operation: 'set' as any,
                  value: '1',
                },
              ],
            },
            condition: {
              urlFilter: 'ws.coze.cn',
              resourceTypes: ['websocket'] as any,
            },
          },
        ]
      : [],
  });
};

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Message received in background:', message);

  // Handle different message types
  if (message.type === 'INIT') {
    sendResponse({ status: 'Background initialized' });
  } else if (message.type === 'UPDATE_PPE') {
    currentPpe = message.value;
    // Save to storage for persistence
    // chrome.storage.local.set({ simultPpe: currentPpe });
    updatePpeRules(currentPpe);
    sendResponse({ status: 'PPE value updated', value: currentPpe });
  }

  // Required for async responses
  return true;
});

// Load the initial PPE value from storage
// chrome.storage.local.get(['simultPpe'], result => {
//   if (result.simultPpe) {
//     currentPpe = result.simultPpe;
//     console.log('Loaded PPE value from storage:', currentPpe);
//   }
//   // Initialize with the loaded value or default
//   updatePpeRules(currentPpe);
// });

// Example of storing data in extension storage
chrome.storage.local.set({ initialized: true }, () => {
  console.log('Extension initialized and storage set');
});
