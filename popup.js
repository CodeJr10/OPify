// check current user settings
let extensionIsEnabled;
function loadSettings() {
  chrome.storage.local.get(
    {
      extensionIsEnabled: true, // default value
    },
    (data) => {
      const btn = document.getElementById("toggleBtn");

      btn.textContent = data.extensionIsEnabled
        ? "Disable Overlay"
        : "Enable Overlay";
      btn.dataset.enabled = data.extensionIsEnabled;
    }
  );
}

function toggleButtonSetting() {
  const btn = document.getElementById("toggleBtn");
  const currentState = btn.dataset.enabled == "true";
  const newState = !currentState;

  chrome.storage.local.set({ extensionIsEnabled: newState }, () => {
    if (chrome.runtime.lastError) {
      console.log("Failed to save", chrome.runtime.lastError);
    } else {
      btn.textContent = newState ? "Disable Overlay" : "Enable Overlay";
      btn.dataset.enabled = newState;
    }
  });
}

document
  .getElementById("toggleBtn")
  .addEventListener("click", toggleButtonSetting);

document.addEventListener("DOMContentLoaded", loadSettings);
