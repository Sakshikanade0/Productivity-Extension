let activeTabUrl = "";
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async () => {
  let tab = await chrome.tabs.get((await chrome.tabs.query({active: true}))[0].id);
  saveTime();
  activeTabUrl = new URL(tab.url).hostname;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    saveTime();
    activeTabUrl = new URL(tab.url).hostname;
    startTime = Date.now();
  }
});

function saveTime() {
  let endTime = Date.now();
  let timeSpent = (endTime - startTime) / 1000;

  if (!activeTabUrl) return;

  chrome.storage.local.get(["usage"], (data) => {
    let usage = data.usage || {};
    usage[activeTabUrl] = (usage[activeTabUrl] || 0) + timeSpent;

    chrome.storage.local.set({ usage });
  });
}
