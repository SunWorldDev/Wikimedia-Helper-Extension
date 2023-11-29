chrome.storage.sync.set({ key: value }).then(() => {
  alert("Value is set");
});

chrome.storage.sync.get(["key"]).then((result) => {
  alert("Value currently is " + result.key);
});
  