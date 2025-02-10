# Reddit Comment Cleaner Extension (old.reddit.com)

A browser extension that automates Reddit comment deletion with persistent tracking and smart pagination.

## Table of Contents 📋
- [Why This Exists](#-why-this-exists)
- [Key Features](#-key-features)
- [Requirements](#-requirements)
- [Installation & Usage](#-installation--usage)
- [Important Notes](#-important-notes)
- [Technical Details](#-technical-details)
- [FAQ](#-faq)

## 💡 Why This Exists
Many users want to manage their digital footprint but find manual comment deletion tedious. This extension solves that problem with smart automation while ensuring user control through pause/resume functionality and visual feedback.

## ✨ Key Features
- 🗑️ Automated comment deletion with confirmation handling
- 🎮 Built-in control panel (Start/Pause/Stop)
- 🔢 Persistent deletion counter across sessions
- 📖 Auto-pagination (every 25 comments)
- 🌐 Works on Chrome, Firefox, Brave, and Edge
- 🎨 Clean floating UI with real-time updates

## ⚙ Requirements
- Modern web browser (Chrome 80+/Firefox 78+/Edge 80+)
- Access to [old.reddit.com](https://old.reddit.com)
- Developer mode enabled in browser

## 🚀 Installation & Usage

### Step 1: Get the Code
```bash
git clone https://github.com/yourusername/reddit-comment-cleaner.git
cd reddit-comment-cleaner
```

### Step 2: Load Extension
**For Chrome/Brave/Edge:**
1. Visit `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `src` folder

**For Firefox:**
1. Visit `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json` file

### Step 3: Start Cleaning
1. Go to your Reddit comments page:
   
   ```
   https://old.reddit.com/user/YOUR_USERNAME/comments/
   ```
   (Replace `YOUR_USERNAME` with your Reddit username)
3. Look for the control panel (bottom-right corner)
4. Click ▶️ **Start** to begin deletion
5. Use ⏸️ **Pause** or 🛑 **Stop** as needed

> The counter persists across page reloads. After 25 deletions, it will automatically load the next page.

## ⚠ Important Notes
- Test with a few comments first
- Reddit may rate-limit aggressive deletions
- Not affiliated with Reddit Inc.
- Use at your own risk

## 🔧 Technical Details

### Core Functionality
| Feature | Description | Tech Used |
|---------|-------------|-----------|
| Automated Deletion | Sequentially deletes comments | DOM Manipulation |
| Smart Pagination | Auto-loads next page | XPath, DOM Observers |
| Persistent State | Maintains counter | Chrome Storage API |
| Visual Controls | Real-time UI updates | CSS Flexbox/Grid |

### Advanced Features
- Dual confirmation handling
- Performance-optimized DOM scanning
- Cross-browser compatibility

## ❓ FAQ
**Q: Is this safe to use?**  
A: While tested extensively, use at your own risk. Reddit may rate-limit aggressive deletion.

**Q: Can I delete specific comments?**  
A: Current version only supports sequential deletion. Filtering system in development.

**Q: Why Old Reddit?**  
A: More stable DOM structure. New Reddit support planned.

## 📜 License
MIT © 2025 Arbaz Ahmad - See [LICENSE](LICENSE) for details
