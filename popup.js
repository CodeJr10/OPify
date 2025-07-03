// check current user settings
function loadSettings() {
  chrome.storage.local.get(
    {
      extensionIsDisabled: false,
    },
    (data) => {
      document.getElementById("disableExtension").checked =
        !data.extensionIsDisabled;
    }
  );
}
