# Creating Icons with 🫂 Emoji

## Website Icons (Next.js)

The website icons are already created as SVG files:
- `packages/website/app/icon.svg` - Favicon (32x32)
- `packages/website/app/apple-icon.svg` - Apple touch icon (180x180)

Next.js will automatically use these when deployed!

## Chrome Extension Icons

For the Chrome extension, you need to create PNG files. Here's how:

### Option 1: Screenshot Method (Quick & Easy)

1. Open `packages/extension/icon.html` in Chrome
2. Zoom to 100%
3. Take a screenshot of just the emoji
4. Crop and resize to create:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)
5. Save them in `packages/extension/`

### Option 2: Online Tool

1. Go to https://favicon.io/emoji-favicons/
2. Search for "people hugging" or paste 🫂
3. Choose background color: #0070f3 (blue) or #ffffff (white)
4. Download the generated icons
5. Rename and resize to 16x16, 48x48, and 128x128
6. Save in `packages/extension/`

### Option 3: Figma/Sketch/Photoshop

1. Create artboards: 16x16, 48x48, 128x128
2. Add 🫂 emoji as text
3. Center it
4. Export as PNG
5. Save in `packages/extension/`

### Option 4: Command Line (macOS with ImageMagick)

```bash
# Install ImageMagick if you don't have it
brew install imagemagick

# Create base 128x128 icon
convert -size 128x128 xc:'#0070f3' \
  -font "Apple-Color-Emoji" -pointsize 80 \
  -fill white -gravity center -annotate +0+0 "🫂" \
  packages/extension/icon128.png

# Resize for other sizes
convert packages/extension/icon128.png -resize 48x48 packages/extension/icon48.png
convert packages/extension/icon128.png -resize 16x16 packages/extension/icon16.png
```

## After Creating Icons

1. Make sure all three PNG files are in `packages/extension/`:
   - icon16.png
   - icon48.png
   - icon128.png

2. Rebuild the extension:
   ```bash
   cd packages/extension
   pnpm build
   ```

3. Reload the extension in Chrome

The 🫂 emoji should now appear as your extension icon!
