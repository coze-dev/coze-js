// Simple content script for the News Verify Extension
console.log('News Verify Extension: Content script loaded');
console.log('News Verify Extension initialized on page:', window.location.href);

// Add event listener for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'checkPage') {
    console.log('Checking page content for verification');
    sendResponse({ status: 'success', url: window.location.href });
  }
  return true;
});
