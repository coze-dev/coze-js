console.log('Simultaneous Interpretation content script loaded');

// Function to initialize the content script
function init() {
  // Send a message to the background script
  chrome.runtime.sendMessage({ type: 'CONTENT_INIT' }, response => {
    console.log('Response from background:', response);
  });

  // Inject a small UI element into the page to show the extension is active
  injectUI();
}

// Function to inject a simple UI element
function injectUI() {
  const container = document.createElement('div');
  container.id = 'simult-extension-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.backgroundColor = 'rgba(22, 119, 255, 0.9)';
  container.style.color = 'white';
  container.style.padding = '10px';
  container.style.borderRadius = '5px';
  container.style.zIndex = '9999';
  container.style.fontSize = '14px';
  container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  container.style.transition = 'opacity 0.3s';
  container.style.cursor = 'pointer';
  container.innerText = 'Simultaneous Interpretation Extension Active';

  // Add a simple hover effect
  container.addEventListener('mouseenter', () => {
    container.style.opacity = '0.8';
  });
  container.addEventListener('mouseleave', () => {
    container.style.opacity = '1';
  });

  // Add click event to hide the element
  container.addEventListener('click', () => {
    container.style.display = 'none';
  });

  document.body.appendChild(container);

  // Hide after 5 seconds
  setTimeout(() => {
    container.style.opacity = '0';
    setTimeout(() => {
      container.style.display = 'none';
    }, 300);
  }, 5000);
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
