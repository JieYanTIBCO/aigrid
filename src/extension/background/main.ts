// Handle extension icon click
chrome.action.onClicked.addListener(() => {
    // Create a new tab with our extension's new tab page
    chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('Background script received message:', message);
    sendResponse({ status: 'ok' });
});
