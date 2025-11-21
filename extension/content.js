chrome.storage.local.get(["blocked"], (data) => {
  let blocked = data.blocked || [];
  let host = window.location.hostname;

  if (blocked.includes(host)) {
    document.body.innerHTML = `
      <h1 style="color: red; text-align:center;">
        This site is blocked for productivity!
      </h1>
    `;
  }
});
