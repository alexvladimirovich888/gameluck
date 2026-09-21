import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Pixel art gold coin with crown/cross medieval stamp and shimmering edges, transparent background
const coinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" shape-rendering="crispEdges">
  <!-- Outer circular pixel contour -->
  <rect x="11" y="2" width="10" height="2" fill="#452305" />
  <rect x="7" y="4" width="4" height="2" fill="#452305" />
  <rect x="21" y="4" width="4" height="2" fill="#452305" />
  <rect x="4" y="6" width="3" height="3" fill="#452305" />
  <rect x="25" y="6" width="3" height="3" fill="#452305" />
  <rect x="2" y="9" width="2" height="4" fill="#452305" />
  <rect x="28" y="9" width="2" height="4" fill="#452305" />
  <rect x="1" y="13" width="2" height="6" fill="#452305" />
  <rect x="29" y="13" width="2" height="6" fill="#452305" />
  <rect x="2" y="19" width="2" height="4" fill="#452305" />
  <rect x="28" y="19" width="2" height="4" fill="#452305" />
  <rect x="4" y="23" width="3" height="3" fill="#452305" />
  <rect x="25" y="23" width="3" height="3" fill="#452305" />
  <rect x="7" y="26" width="4" height="2" fill="#452305" />
  <rect x="21" y="26" width="4" height="2" fill="#452305" />
  <rect x="11" y="28" width="10" height="2" fill="#452305" />

  <!-- Outer beveled gold ring -->
  <!-- Top & Left bright highlight rim -->
  <rect x="11" y="4" width="10" height="2" fill="#fef08a" />
  <rect x="7" y="6" width="4" height="2" fill="#fef08a" />
  <rect x="5" y="8" width="2" height="3" fill="#fef08a" />
  <rect x="3" y="11" width="2" height="4" fill="#fef08a" />
  <rect x="3" y="15" width="2" height="4" fill="#facc15" />
  <rect x="4" y="19" width="2" height="3" fill="#eab308" />

  <!-- Bottom & Right deep shadow rim -->
  <rect x="21" y="6" width="4" height="2" fill="#ca8a04" />
  <rect x="25" y="8" width="2" height="3" fill="#a16207" />
  <rect x="27" y="11" width="2" height="4" fill="#854d0e" />
  <rect x="27" y="15" width="2" height="6" fill="#713f12" />
  <rect x="25" y="21" width="2" height="3" fill="#713f12" />
  <rect x="21" y="24" width="4" height="2" fill="#713f12" />
  <rect x="11" y="26" width="10" height="2" fill="#713f12" />
  <rect x="6" y="24" width="5" height="2" fill="#a16207" />
  <rect x="4" y="21" width="2" height="3" fill="#ca8a04" />

  <!-- Main inner coin face -->
  <rect x="11" y="6" width="10" height="20" fill="#eab308" />
  <rect x="7" y="8" width="18" height="16" fill="#eab308" />
  <rect x="5" y="11" width="22" height="10" fill="#eab308" />

  <!-- Inner coin embossed ridge -->
  <rect x="11" y="7" width="10" height="1" fill="#fef9c3" />
  <rect x="8" y="9" width="3" height="1" fill="#fef9c3" />
  <rect x="6" y="11" width="2" height="2" fill="#fef9c3" />
  <rect x="5" y="13" width="1" height="6" fill="#fef9c3" />

  <rect x="26" y="13" width="1" height="6" fill="#854d0e" />
  <rect x="24" y="19" width="2" height="2" fill="#854d0e" />
  <rect x="21" y="22" width="3" height="1" fill="#854d0e" />
  <rect x="11" y="24" width="10" height="1" fill="#854d0e" />
  <rect x="8" y="22" width="3" height="1" fill="#ca8a04" />

  <!-- Medieval Royal Crown / Florin Stamp in Center -->
  <!-- Crown peaks and base -->
  <rect x="9" y="12" width="2" height="2" fill="#854d0e" />
  <rect x="15" y="10" width="2" height="3" fill="#854d0e" />
  <rect x="21" y="12" width="2" height="2" fill="#854d0e" />

  <rect x="10" y="14" width="12" height="2" fill="#854d0e" />
  <rect x="11" y="16" width="10" height="4" fill="#a16207" />
  <rect x="13" y="17" width="6" height="2" fill="#713f12" />
  <rect x="10" y="20" width="12" height="2" fill="#854d0e" />

  <!-- Crown Jewels / Highlight dots -->
  <rect x="9" y="12" width="1" height="1" fill="#fef08a" />
  <rect x="15" y="10" width="1" height="1" fill="#ffffff" />
  <rect x="21" y="12" width="1" height="1" fill="#fef08a" />
  <rect x="12" y="18" width="1" height="1" fill="#fef9c3" />
  <rect x="15" y="17" width="2" height="1" fill="#fde047" />
  <rect x="19" y="18" width="1" height="1" fill="#fef9c3" />

  <!-- Shimmering Sparkle Glint on Top-Left Corner -->
  <rect x="7" y="6" width="2" height="2" fill="#ffffff" />
  <rect x="8" y="5" width="1" height="4" fill="#ffffff" />
  <rect x="6" y="7" width="4" height="1" fill="#ffffff" />
</svg>`;

async function main() {
  const publicItemsDir = path.join(process.cwd(), 'public/assets/items');
  const publicUiDir = path.join(process.cwd(), 'public/assets/ui');

  // Save SVGs
  fs.writeFileSync(path.join(publicItemsDir, 'coin.svg'), coinSvg.trim());
  fs.writeFileSync(path.join(publicUiDir, 'coin.svg'), coinSvg.trim());

  // Render PNGs with sharp
  const buffer64 = await sharp(Buffer.from(coinSvg)).resize(64, 64, { kernel: 'nearest' }).png().toBuffer();
  fs.writeFileSync(path.join(publicItemsDir, 'coin.png'), buffer64);
  fs.writeFileSync(path.join(publicUiDir, 'coin.png'), buffer64);

  // Also create a 32x32 and 128x128 for high-dpi rendering
  const buffer128 = await sharp(Buffer.from(coinSvg)).resize(128, 128, { kernel: 'nearest' }).png().toBuffer();
  fs.writeFileSync(path.join(publicUiDir, 'coin_gold.png'), buffer128);

  console.log('Successfully generated transparent, crisp medieval gold coin assets in items and ui!');
}

main().catch(console.error);
