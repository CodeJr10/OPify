# 🏴‍☠️ OPify – One Piece YouTube Thumbnail Overlay Extension

**OPify** is a fun Chrome extension that modifies YouTube thumbnails to overlay characters from **One Piece** – starting with the Straw Hat crew!

> Inspired by MrBeastify, but with a pirate twist. 🍖⚔️

---

## 🚀 Features

- ✅ Automatically overlays Straw Hat characters on YouTube thumbnails  
- ⚙️ Runs seamlessly on all YouTube pages  
- 💾 Remembers your settings using Chrome Storage  
- 🔄 Loads instantly on every page view (`document_idle`)

---

## 💡 Ideas

- 🎯 **Character-Specific Overlay Mode**  
  Want only Luffy? Or maybe Zoro?  
  → Planning to allow selecting a specific Straw Hat character to display instead of random ones.

---

## 📅 Future Plans

- 🔁 **Auto Version Bump Script**  
  Add a script to automatically increment the `manifest.json` version on every local test commit.  

- 🧪 **Character Toggle Menu**  
  Add a popup UI to enable/disable specific Straw Hats.

- ⚡ **Performance Optimization**  
  Improve script injection and DOM manipulation performance.

- 🚀 **To be safe, you can define multiple icons like this:**

json
Copy
Edit
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "96": "icons/icon96.png",
  "128": "icons/icon128.png"
}
That way, Chrome chooses the most appropriate one depending on context and screen resolution (especially for Retina/4K displays).

---

## 🛠️ Development

### 1. Load Locally
1. Clone this repo
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load unpacked** and select the extension folder

### 2. Make Changes
- Update files (JS/CSS/HTML/images)
- Increment the version number in `manifest.json`:
  ```json
  "version": "0.1.1"
