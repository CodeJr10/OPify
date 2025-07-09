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

// prettier-ignore
document.addEventListener("DOMContentLoaded", () => {
  loadSettings(); // load initial state

  // Now that the DOM is ready, it's safe to access the button
  //prettier-ignore
  document.getElementById("toggleExtension").addEventListener("click", toggleOverlay);
});
