// check current user settings
function loadSettings() {
  chrome.storage.local.get(
    {
      extensionIsEnabled: true, // default value
    },
    (data) => {
      document.getElementById("enableExtension").checked =
        data.extensionIsEnabled;
    }
  );
}

function saveSettings() {
  const data = {
    extensionIsEnabled: document.getElementById("enableExtension").checked,
  };

  chrome.storage.local.set(data, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving settings", chrome.runtime.lastError);
    } else {
      console.log("Settings are saved");
    }
  });
}
