document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(["usage"], (data) => {
    let usage = data.usage || {};
    let output = "";

    for (let site in usage) {
      output += `<p><b>${site}</b>: ${Math.floor(usage[site])} sec</p>`;
    }

    document.getElementById("usage").innerHTML = output;
  });

  document.getElementById("blockBtn").onclick = () => {
    let site = document.getElementById("blockInput").value.trim();
    if (!site) return;

    chrome.storage.local.get(["blocked"], (data) => {
      let blocked = data.blocked || [];
      blocked.push(site);
      chrome.storage.local.set({ blocked });
      alert("Site Blocked");
    });
  };
});
