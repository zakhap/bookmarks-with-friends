// Background service worker for Chrome extension
// Currently minimal, can be extended with background sync, notifications, etc.

chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmarks extension installed');
});

// Handle any background tasks here if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Future: Handle background sync, notifications, etc.
  return true;
});
