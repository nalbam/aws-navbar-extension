chrome.runtime.onInstalled.addListener(() => {
  // Initialize local storage (consistent with main.js and popup.js)
  chrome.storage.local.get('config', (result) => {
    if (!result.config) {
      chrome.storage.local.set({ config: {} });
    }
  });
});
