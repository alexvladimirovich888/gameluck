import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper function to build crisp SVG on a pixel grid
function buildSvg(width: number, height: number, rects: string, defs = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
    ${defs}
    ${rects}
  </svg>`;
}

const targetDir = path.resolve('public/assets/ui');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. INVENTORY SLOT (48x48)
async function generateInventorySlot() {
  const w = 48;
  const h = 48;
  let r = '';

  // Outer dark rim
  r += `<rect width="${w}" height="${h}" fill="#100804" rx="2" />`;
  // Chiseled iron/stone border
  r += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#2e1a10" />`;
  // Inner deep shadow
  r += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#140a05" />`;
  // Corner brass rivets
  const rivets = [{ x: 4, y: 4 }, { x: w - 8, y: 4 }, { x: 4, y: h - 8 }, { x: w - 8, y: h - 8 }];
  for (const riv of rivets) {
    r += `<rect x="${riv.x}" y="${riv.y}" width="4" height="4" fill="#854d0e" />`;
    r += `<rect x="${riv.x + 1}" y="${riv.y + 1}" width="2" height="2" fill="#facc15" />`;
    r += `<rect x="${riv.x + 1}" y="${riv.y}" width="1" height="1" fill="#fef08a" />`;
  }
  // Subtle diagonal slot texture
  for (let i = 8; i < w - 8; i += 8) {
    r += `<rect x="${i}" y="8" width="1" height="${h - 16}" fill="#1e1008" opacity="0.6" />`;
  }

  const svgNormal = buildSvg(w, h, r);
  fs.writeFileSync(path.join(targetDir, 'inventory_slot.svg'), svgNormal);
  await sharp(Buffer.from(svgNormal)).png().toFile(path.join(targetDir, 'inventory_slot.png'));

  // Active / Selected Slot (golden glow border)
  let rActive = r;
  rActive += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="#eab308" stroke-width="2" />`;
  rActive += `<rect x="3" y="3" width="${w - 6}" height="${h - 6}" fill="none" stroke="#fde047" stroke-width="1" />`;
  const svgActive = buildSvg(w, h, rActive);
  fs.writeFileSync(path.join(targetDir, 'inventory_slot_active.svg'), svgActive);
  await sharp(Buffer.from(svgActive)).png().toFile(path.join(targetDir, 'inventory_slot_active.png'));
}

// 2. WOODEN BUTTON (Normal, Hover, Pressed)
async function generateButtons() {
  const w = 96;
  const h = 32;

  // Normal Button
  let r = '';
  // Outer border
  r += `<rect width="${w}" height="${h}" fill="#100703" rx="2" />`;
  // Outer bevel
  r += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#78350f" />`;
  // Top & left bevel highlight
  r += `<rect x="2" y="2" width="${w - 4}" height="2" fill="#d97706" />`;
  r += `<rect x="2" y="2" width="2" height="${h - 4}" fill="#d97706" />`;
  // Bottom & right bevel shadow
  r += `<rect x="2" y="${h - 4}" width="${w - 4}" height="2" fill="#451a03" />`;
  r += `<rect x="${w - 4}" y="2" width="2" height="${h - 4}" fill="#451a03" />`;
  // Inner button face
  r += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#9a3412" />`;
  // Golden inner outline
  r += `<rect x="5" y="5" width="${w - 10}" height="${h - 10}" fill="none" stroke="#ca8a04" stroke-width="1" />`;
  // Corner rivets
  const rivets = [{ x: 6, y: 6 }, { x: w - 9, y: 6 }, { x: 6, y: h - 9 }, { x: w - 9, y: h - 9 }];
  for (const riv of rivets) {
    r += `<rect x="${riv.x}" y="${riv.y}" width="3" height="3" fill="#fde047" />`;
    r += `<rect x="${riv.x + 1}" y="${riv.y + 1}" width="1" height="1" fill="#78350f" />`;
  }

  const svgNormal = buildSvg(w, h, r);
  fs.writeFileSync(path.join(targetDir, 'button_wood.svg'), svgNormal);
  await sharp(Buffer.from(svgNormal)).png().toFile(path.join(targetDir, 'button_wood.png'));

  // Pressed Button
  let rPressed = '';
  rPressed += `<rect width="${w}" height="${h}" fill="#100703" rx="2" />`;
  rPressed += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#451a03" />`;
  rPressed += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#78350f" />`;
  rPressed += `<rect x="4" y="4" width="${w - 8}" height="3" fill="#291103" />`;
  rPressed += `<rect x="5" y="5" width="${w - 10}" height="${h - 10}" fill="none" stroke="#854d0e" stroke-width="1" />`;
  for (const riv of rivets) {
    rPressed += `<rect x="${riv.x}" y="${riv.y + 1}" width="3" height="3" fill="#ca8a04" />`;
  }
  const svgPressed = buildSvg(w, h, rPressed);
  await sharp(Buffer.from(svgPressed)).png().toFile(path.join(targetDir, 'button_wood_pressed.png'));

  // Buy Button (Greenish Emerald / Gold)
  let rBuy = '';
  rBuy += `<rect width="${w}" height="${h}" fill="#052e16" rx="2" />`;
  rBuy += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#166534" />`;
  rBuy += `<rect x="2" y="2" width="${w - 4}" height="2" fill="#4ade80" />`;
  rBuy += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#15803d" />`;
  rBuy += `<rect x="5" y="5" width="${w - 10}" height="${h - 10}" fill="none" stroke="#86efac" stroke-width="1" />`;
  const svgBuy = buildSvg(w, h, rBuy);
  fs.writeFileSync(path.join(targetDir, 'button_buy.svg'), svgBuy);
  await sharp(Buffer.from(svgBuy)).png().toFile(path.join(targetDir, 'button_buy.png'));

  // Sell Button (Burgundy / Red)
  let rSell = '';
  rSell += `<rect width="${w}" height="${h}" fill="#450a0a" rx="2" />`;
  rSell += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#991b1b" />`;
  rSell += `<rect x="2" y="2" width="${w - 4}" height="2" fill="#f87171" />`;
  rSell += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#b91c1c" />`;
  rSell += `<rect x="5" y="5" width="${w - 10}" height="${h - 10}" fill="none" stroke="#fca5a5" stroke-width="1" />`;
  const svgSell = buildSvg(w, h, rSell);
  fs.writeFileSync(path.join(targetDir, 'button_sell.svg'), svgSell);
  await sharp(Buffer.from(svgSell)).png().toFile(path.join(targetDir, 'button_sell.png'));
}

// 3. WAX SEAL (Red with Merchant Scales)
async function generateWaxSeal() {
  const s = 64;
  let r = '';
  // Wax puddle outline
  r += `<circle cx="32" cy="32" r="28" fill="#7f1d1d" />`;
  r += `<circle cx="32" cy="32" r="25" fill="#991b1b" />`;
  // Uneven stamped wax edge
  const blobs = [
    { cx: 8, cy: 30, r: 6 }, { cx: 56, cy: 34, r: 6 },
    { cx: 30, cy: 8, r: 6 }, { cx: 34, cy: 56, r: 6 },
    { cx: 14, cy: 14, r: 5 }, { cx: 50, cy: 14, r: 5 },
    { cx: 14, cy: 50, r: 5 }, { cx: 50, cy: 50, r: 5 }
  ];
  for (const b of blobs) {
    r += `<circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="#991b1b" />`;
    r += `<circle cx="${b.cx}" cy="${b.cy}" r="${b.r - 2}" fill="#b91c1c" />`;
  }
  // Stamped depressed inner circle
  r += `<circle cx="32" cy="32" r="20" fill="#7f1d1d" />`;
  r += `<circle cx="32" cy="32" r="19" fill="#991b1b" />`;
  r += `<circle cx="32" cy="32" r="17" fill="none" stroke="#f87171" stroke-width="1" opacity="0.6" />`;
  // Scales of trade crest in gold
  // Center beam
  r += `<rect x="20" y="24" width="24" height="2" fill="#fde047" />`;
  // Pillar
  r += `<rect x="31" y="20" width="2" height="18" fill="#fde047" />`;
  r += `<rect x="29" y="38" width="6" height="2" fill="#fde047" />`;
  // Left pan
  r += `<rect x="22" y="26" width="1" height="6" fill="#fef08a" />`;
  r += `<path d="M 18 32 Q 22.5 35 27 32 Z" fill="#fde047" />`;
  // Right pan
  r += `<rect x="41" y="26" width="1" height="6" fill="#fef08a" />`;
  r += `<path d="M 37 32 Q 41.5 35 46 32 Z" fill="#fde047" />`;

  const svg = buildSvg(s, s, r);
  fs.writeFileSync(path.join(targetDir, 'wax_seal.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(targetDir, 'wax_seal.png'));
}

// 4. COMPASS ROSE (For map navigation)
async function generateCompassRose() {
  const s = 64;
  let r = '';
  // Brass outer ring
  r += `<circle cx="32" cy="32" r="28" fill="#451a03" />`;
  r += `<circle cx="32" cy="32" r="26" fill="#ca8a04" />`;
  r += `<circle cx="32" cy="32" r="24" fill="#fde047" />`;
  r += `<circle cx="32" cy="32" r="22" fill="#1e1008" />`;
  // 8 Point Star
  // North point (Red)
  r += `<polygon points="32,10 35,32 32,32" fill="#dc2626" />`;
  r += `<polygon points="32,10 29,32 32,32" fill="#ef4444" />`;
  // South point (Steel)
  r += `<polygon points="32,54 35,32 32,32" fill="#94a3b8" />`;
  r += `<polygon points="32,54 29,32 32,32" fill="#cbd5e1" />`;
  // East point
  r += `<polygon points="54,32 32,29 32,32" fill="#d97706" />`;
  r += `<polygon points="54,32 32,35 32,32" fill="#f59e0b" />`;
  // West point
  r += `<polygon points="10,32 32,29 32,32" fill="#d97706" />`;
  r += `<polygon points="10,32 32,35 32,32" fill="#f59e0b" />`;
  // Center jewel
  r += `<circle cx="32" cy="32" r="5" fill="#ca8a04" />`;
  r += `<circle cx="32" cy="32" r="3" fill="#fde047" />`;
  r += `<circle cx="32" cy="32" r="1.5" fill="#ffffff" />`;

  const svg = buildSvg(s, s, r);
  fs.writeFileSync(path.join(targetDir, 'compass_rose.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(targetDir, 'compass_rose.png'));
}

// 5. MEDIEVAL HUD HEADER FRAME (Wide 600x64 banner)
async function generateHudHeaderFrame() {
  const w = 600;
  const h = 64;
  let r = '';
  // Outer dark boundary
  r += `<rect width="${w}" height="${h}" fill="#100703" rx="4" />`;
  // Timber panel planks
  r += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#3b2011" />`;
  // Wood grain slats
  for (let y = 14; y < h - 4; y += 16) {
    r += `<rect x="2" y="${y}" width="${w - 4}" height="2" fill="#24140a" />`;
    r += `<rect x="2" y="${y + 2}" width="${w - 4}" height="1" fill="#542e18" opacity="0.5" />`;
  }
  // Golden top filigree border
  r += `<rect x="2" y="2" width="${w - 4}" height="3" fill="#ca8a04" />`;
  r += `<rect x="4" y="3" width="${w - 8}" height="1" fill="#fef08a" />`;
  // Golden bottom border
  r += `<rect x="2" y="${h - 5}" width="${w - 4}" height="3" fill="#ca8a04" />`;

  // Left & Right corner brass brackets
  const corners = [
    { x: 2, y: 2, w: 24, h: 24 },
    { x: w - 26, y: 2, w: 24, h: 24 },
    { x: 2, y: h - 26, w: 24, h: 24 },
    { x: w - 26, y: h - 26, w: 24, h: 24 }
  ];
  for (const c of corners) {
    r += `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="#b45309" opacity="0.9" />`;
    r += `<rect x="${c.x + 2}" y="${c.y + 2}" width="${c.w - 4}" height="${c.h - 4}" fill="#d97706" />`;
    r += `<rect x="${c.x + 4}" y="${c.y + 4}" width="4" height="4" fill="#fde047" />`;
  }

  // Center crest plaque (where "MARKETBURG" or town name sits)
  const cx = w / 2;
  r += `<rect x="${cx - 100}" y="4" width="200" height="${h - 8}" fill="#24140a" rx="2" />`;
  r += `<rect x="${cx - 98}" y="6" width="196" height="${h - 12}" fill="#451a03" />`;
  r += `<rect x="${cx - 96}" y="8" width="192" height="${h - 16}" fill="none" stroke="#ca8a04" stroke-width="2" />`;
  r += `<rect x="${cx - 94}" y="10" width="188" height="${h - 20}" fill="none" stroke="#fde047" stroke-width="1" />`;

  const svg = buildSvg(w, h, r);
  fs.writeFileSync(path.join(targetDir, 'hud_header_frame.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(targetDir, 'hud_header_frame.png'));
}

// 6. PARCHMENT SCROLL FRAME (for dialogues and notifications)
async function generateParchmentScroll() {
  const w = 400;
  const h = 240;
  let r = '';
  // Torn paper drop shadow
  r += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="#100703" opacity="0.6" rx="6" />`;
  // Parchment paper body
  r += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="#ebd6b5" rx="4" />`;
  // Darker aged paper borders
  r += `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="#c2a882" stroke-width="6" rx="4" />`;
  r += `<rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="#854d0e" stroke-width="2" rx="2" />`;
  // Rolled scroll top and bottom wooden rods
  r += `<rect x="0" y="0" width="${w}" height="8" fill="#542e18" rx="2" />`;
  r += `<rect x="2" y="2" width="${w - 4}" height="4" fill="#9a3412" />`;
  r += `<rect x="0" y="${h - 8}" width="${w}" height="8" fill="#542e18" rx="2" />`;
  r += `<rect x="2" y="${h - 6}" width="${w - 4}" height="4" fill="#9a3412" />`;
  // Knobs at rod ends
  r += `<circle cx="4" cy="4" r="6" fill="#ca8a04" />`;
  r += `<circle cx="${w - 4}" cy="4" r="6" fill="#ca8a04" />`;
  r += `<circle cx="4" cy="${h - 4}" r="6" fill="#ca8a04" />`;
  r += `<circle cx="${w - 4}" cy="${h - 4}" r="6" fill="#ca8a04" />`;

  const svg = buildSvg(w, h, r);
  fs.writeFileSync(path.join(targetDir, 'parchment_scroll.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(targetDir, 'parchment_scroll.png'));
}

// 7. WOOD PANEL (General container tile)
async function generateWoodPanel() {
  const w = 128;
  const h = 128;
  let r = '';
  // Outer boundary
  r += `<rect width="${w}" height="${h}" fill="#140803" />`;
  // Plank 1
  r += `<rect x="2" y="2" width="${w - 4}" height="40" fill="#3b2011" />`;
  r += `<rect x="2" y="40" width="${w - 4}" height="2" fill="#1b0e06" />`;
  // Plank 2
  r += `<rect x="2" y="42" width="${w - 4}" height="42" fill="#422514" />`;
  r += `<rect x="2" y="82" width="${w - 4}" height="2" fill="#1b0e06" />`;
  // Plank 3
  r += `<rect x="2" y="84" width="${w - 4}" height="42" fill="#381d0f" />`;

  // Timber grain strokes
  for (let y = 10; y < h - 10; y += 18) {
    r += `<rect x="8" y="${y}" width="60" height="1" fill="#5c341c" opacity="0.4" />`;
    r += `<rect x="80" y="${y + 6}" width="40" height="1" fill="#5c341c" opacity="0.4" />`;
  }
  // Iron reinforced border
  r += `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#24140a" stroke-width="4" />`;
  r += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="none" stroke="#5c371e" stroke-width="1" />`;
  // Corner iron studs
  const studs = [
    { x: 5, y: 5 }, { x: w - 9, y: 5 }, { x: 5, y: h - 9 }, { x: w - 9, y: h - 9 }
  ];
  for (const s of studs) {
    r += `<rect x="${s.x}" y="${s.y}" width="4" height="4" fill="#78350f" />`;
    r += `<rect x="${s.x + 1}" y="${s.y + 1}" width="2" height="2" fill="#ca8a04" />`;
  }

  const svg = buildSvg(w, h, r);
  fs.writeFileSync(path.join(targetDir, 'wood_panel.svg'), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(targetDir, 'wood_panel.png'));
}

async function run() {
  console.log('Generating authentic medieval pixel UI components...');
  await generateInventorySlot();
  await generateButtons();
  await generateWaxSeal();
  await generateCompassRose();
  await generateHudHeaderFrame();
  await generateParchmentScroll();
  await generateWoodPanel();
  console.log('All pixel UI assets successfully generated!');
}

run().catch(console.error);
