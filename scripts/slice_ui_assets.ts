import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function processUiAssets() {
  const uiImgPath = path.resolve('src/assets/images/medieval_pixel_ui_1790011121511.jpg');
  const hudImgPath = path.resolve('src/assets/images/medieval_hud_frame_1790011134504.jpg');

  const uiMeta = await sharp(uiImgPath).metadata();
  console.log('UI Sheet Meta:', uiMeta.width, 'x', uiMeta.height);

  const hudMeta = await sharp(hudImgPath).metadata();
  console.log('HUD Frame Meta:', hudMeta.width, 'x', hudMeta.height);

  const targetUiDir = path.resolve('public/assets/ui');
  if (!fs.existsSync(targetUiDir)) {
    fs.mkdirSync(targetUiDir, { recursive: true });
  }

  // Copy full high-res HUD frame to public
  await sharp(hudImgPath)
    .resize(1280, 720, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(targetUiDir, 'hud_banner_bg.jpg'));

  // Copy main UI sprite sheet to public
  fs.copyFileSync(uiImgPath, path.join(targetUiDir, 'medieval_ui_sheet.jpg'));

  // Now let's slice specific UI parts from the 1:1 sprite sheet
  const W = uiMeta.width || 1024;
  const H = uiMeta.height || 1024;

  // 1. Red Wax Seal (bottom right or quadrant)
  // Let's crop key quadrant UI components
  // Top-left: Ornate banner / parchment
  await sharp(uiImgPath)
    .extract({ left: 0, top: 0, width: Math.floor(W * 0.6), height: Math.floor(H * 0.35) })
    .png()
    .toFile(path.join(targetUiDir, 'royal_header_banner.png'));

  // Middle parchment scroll box
  await sharp(uiImgPath)
    .extract({ left: Math.floor(W * 0.1), top: Math.floor(H * 0.3), width: Math.floor(W * 0.8), height: Math.floor(H * 0.45) })
    .png()
    .toFile(path.join(targetUiDir, 'parchment_scroll_panel.png'));

  // Wax seal (usually near bottom or side)
  await sharp(uiImgPath)
    .extract({ left: Math.floor(W * 0.72), top: Math.floor(H * 0.7), width: Math.floor(W * 0.25), height: Math.floor(H * 0.25) })
    .png()
    .toFile(path.join(targetUiDir, 'wax_seal.png'));

  // Coin purse / chest (bottom left / center)
  await sharp(uiImgPath)
    .extract({ left: Math.floor(W * 0.05), top: Math.floor(H * 0.7), width: Math.floor(W * 0.3), height: Math.floor(H * 0.25) })
    .png()
    .toFile(path.join(targetUiDir, 'gold_pouch.png'));

  // Wood button tile
  await sharp(uiImgPath)
    .extract({ left: Math.floor(W * 0.38), top: Math.floor(H * 0.75), width: Math.floor(W * 0.3), height: Math.floor(H * 0.2) })
    .png()
    .toFile(path.join(targetUiDir, 'wood_button_plate.png'));

  console.log('UI Slicing completed successfully!');
}

processUiAssets().catch(console.error);
