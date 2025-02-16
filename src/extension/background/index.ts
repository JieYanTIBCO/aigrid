import { chatGPTManager } from './auth';

chrome.runtime.onInstalled.addListener(() => {
  chatGPTManager.authenticate().catch((error) => {
    console.error('Initial authentication failed:', error);
  });
});
