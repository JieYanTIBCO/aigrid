console.log('Background service worker started');

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'index.html'
  });
});
