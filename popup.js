let isExtensionEnabled; // default state

function loadSettings() {
  chrome.storage.local.get({ isExtensionEnabled: true }, (data) => {
    const btn = document.getElementById("toggleExtension");

    btn.textContent = data.isExtensionEnabled
      ? "Disable Overlay"
      : "Enable Overlay";
    btn.dataset.enabled = data.isExtensionEnabled; // add a data attribute enabled=true on the button
  });
}

function toggleOverlay() {
  const btn = document.getElementById("toggleExtension");

  const currentState = btn.dataset.enabled == "true";
  const newState = !currentState; // set new state to the opposite of current state

  chrome.storage.local.set({ isExtensionEnabled: newState }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error setting storage:", chrome.runtime.lastError);
      return;
    } else {
      btn.textContent = newState ? "Disable Overlay" : "Enable Overlay";
      btn.dataset.enabled = newState; // update the data attribute to reflect the new state
    }
  });
}

document
  .getElementById("toggleExtension")
  .addEventListener("click", toggleOverlay);
document.addEventListener("DOMContentLoaded", loadSettings); // Load settings when the html page is first parsed and loaded before any other scripts run
// Add click event listener to the button
