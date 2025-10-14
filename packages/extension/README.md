# Chrome Extension

## Building the Extension

```bash
pnpm build
```

This will create a `dist/` folder with the compiled extension.

## Creating Icons

Before loading the extension, you need to create icon files. For a quick MVP, you can:

1. **Use emoji screenshot:** Take screenshots of the 🔖 emoji at different sizes
2. **Use online icon generator:** Visit https://realfavicongenerator.net or similar
3. **Create simple colored squares** in any image editor

You need three sizes:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

Place them directly in `packages/extension/` directory (NOT in src/ or dist/).

Then rebuild: `pnpm build`

## Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `packages/extension/dist` folder
5. The extension should now appear in your extensions list

## First-time Setup

1. Click the extension icon
2. Click "Extension Settings"
3. Enter:
   - **API URL**: Your deployed Vercel URL (e.g., `https://bookmarks-with-friends.vercel.app`)
   - **API Key**: The shared secret key you set in environment variables
   - **Your Name**: How you want your name to appear on bookmarks
4. Save settings

## Usage

1. Navigate to any webpage you want to bookmark
2. Click the extension icon
3. The URL and title will be pre-filled
4. Optionally add a note
5. Click "Save Bookmark"
