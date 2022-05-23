chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({});
  console.log('storage initialized');
});
